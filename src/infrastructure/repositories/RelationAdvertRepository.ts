import { RepositoryContract } from 'domain/contracts/repository/RepositoryContract';
import { RelationAdvertLinkModel, RelationAdvertLinkType, RelationAdvertModel } from 'domain/models/RelationAdvertModel';
import { ApiService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import FileService from 'application/services/FileService';
import endpoints from '../routes/endpoints';
import url from '../../utils/url';
import date from '../../utils/date';

interface GetRelationAdvertsResponse {
    digiAdverts: Array<{
        label: string;
        id: number;
        isLocked: boolean;
        dateStart: number | null;
        dateFinal: number | null;
        url: string | null;
        linkedArticleId: number | null;
        linkedPage: number;
        status: string;
        imageUrl: string;
        typeId: number;
        typeLabel: string;
        inlineAdvertIntervalSeconds: number | null;
    }>
}

interface GetRelationAdvertResponse {
    digiAdvert: {
        label: string;
        id: number;
        isLocked: boolean;
        dateStart: number | null;
        dateFinal: number | null;
        url: string | null;
        linkedArticleId: number | null;
        linkedPage: number;
        status: string;
        imageUrl: string;
        typeId: number;
        typeLabel: string;
        inlineAdvertIntervalSeconds: number | null;
    }
}

interface UpdateRelationAdvertPayload {
    id: number;
    label: string;
    dateStart: number | null;
    dateFinal: number | null;
    imageData: string,
    linkedArticleId: number | null;
    linkedPage: number | null;
    url: string | null;
    isLocked: boolean,
    typeId: number;
    inlineAdvertIntervalSeconds: number | null;
}

interface CreateRelationAdvertPayload {
    label: string;
    dateStart: number | null;
    dateFinal: number | null;
    imageData: string;
    linkedArticleId: number | null;
    linkedPage: number | null;
    url: string | null;
    typeId: number;
    inlineAdvertIntervalSeconds: number | null;
}

function retrieveRelationAdvertLinkType(advert: RelationAdvertLinkModel): RelationAdvertLinkType {
    if (advert?.url) return 'url';
    if (advert?.linkedArticleId) return 'article';
    return 'none';
}

export default function RelationAdvertRepository(): RepositoryContract<RelationAdvertModel> {
    const apiService = Container.resolve(ApiService);
    const fileService = Container.resolve(FileService);

    async function getAll(): Promise<RelationAdvertModel[] | null> {
        const { digiAdverts } = await apiService.request(endpoints.getRelationAdverts)
            .send<GetRelationAdvertsResponse>();

        if (!digiAdverts) {
            return null;
        }

        return Promise.all(
            digiAdverts.map(async (advert): Promise<RelationAdvertModel> => {
                const image: FileShape | null = advert.imageUrl
                    ? {
                        content: await fileService.urlToBase64(url.decache(advert.imageUrl)),
                        name: 'image.png',
                    }
                    : null;

                return {
                    ...advert,
                    startDate: date.unix(advert.dateStart),
                    endDate: date.unix(advert.dateFinal),
                    image,
                    linkType: retrieveRelationAdvertLinkType(advert),
                };
            }),
        );
    }

    async function getById(id: number): Promise<RelationAdvertModel | null> {
        const { digiAdvert } = await apiService.request(endpoints.getRelationAdvert)
            .send<GetRelationAdvertResponse>({ id });

        if (!digiAdvert) {
            return null;
        }

        const image: FileShape | null = digiAdvert.imageUrl
            ? {
                content: await fileService.urlToBase64(url.decache(digiAdvert.imageUrl)),
                name: 'image.png',
            }
            : null;

        return {
            ...digiAdvert,
            startDate: date.unix(digiAdvert.dateStart),
            endDate: date.unix(digiAdvert.dateFinal),
            image,
            linkType: retrieveRelationAdvertLinkType(digiAdvert),
        };
    }

    async function create(advert: RelationAdvertModel): Promise<boolean> {
        const payload: Partial<CreateRelationAdvertPayload> = {
            dateStart: date.unix(advert.startDate),
            dateFinal: date.unix(advert.endDate),
            imageData: advert.image?.content,
            linkedArticleId: advert.linkedArticleId,
            linkedPage: advert.linkedPage,
            url: advert.url,
            typeId: advert.typeId,
            inlineAdvertIntervalSeconds: advert.inlineAdvertIntervalSeconds,
        };

        const { success } = await apiService.request(endpoints.createRelationAdvert)
            .send<{ success: boolean }>(payload);

        return success || false;
    }

    async function update(advert: RelationAdvertModel): Promise<boolean> {
        const payload: Partial<UpdateRelationAdvertPayload> = {
            id: advert.id,
            dateStart: advert.startDate ? date.unix(advert.startDate) : undefined,
            dateFinal: advert.endDate ? date.unix(advert.endDate) : undefined,
            imageData: advert.image?.content,
            linkedArticleId: advert.linkedArticleId,
            linkedPage: advert.linkedPage,
            url: advert.url,
            isLocked: advert.isLocked,
            typeId: advert.typeId,
            inlineAdvertIntervalSeconds: advert.inlineAdvertIntervalSeconds,
        };

        const { success } = await apiService.request(endpoints.updateRelationAdvert)
            .send<{ success: boolean }>(payload);

        return success || false;
    }

    async function remove(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deleteRelationAdvert)
            .send<{ success: boolean }>({ id });

        return success || false;
    }

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
}
