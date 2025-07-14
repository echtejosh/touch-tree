import { RepositoryContract } from 'domain/contracts/repository/RepositoryContract';
import { AdvertLinkModel, AdvertModel } from 'domain/models/AdvertModel';
import { ApiService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import FileService from 'application/services/FileService';
import endpoints from '../routes/endpoints';
import url from '../../utils/url';
import date from '../../utils/date';

interface GetAdvertResponse {
    label: string;
    id: number;
    isLocked: boolean;
    dateStart: number | null;
    dateFinal: number | null;
    isHighlight: boolean;
    linkedCampaigns: Array<{
        id: number;
        campaignId: number;
        campaignLabel: string;
    }>;
    url: string | null;
    linkedArticleId: number | null;
    linkedPage: number;
    status: string;
    imageUrl: string;
}

interface UpdateAdvertPayload {
    id: number;
    label: string;
    dateStart: number | null;
    dateFinal: number | null;
    imageData: string,
    linkedArticleId: number | null;
    linkedPage: number | null;
    url: string | null;
    isLocked: boolean,
}

interface CreateAdvertPayload {
    label: string;
    dateStart: number | null;
    dateFinal: number | null;
    imageData: string;
    linkedArticleId: number | null;
    linkedPage: number | null;
    url: string | null;
    isHighlight: boolean;
}
function retrieveAdvertLinkType(linkage: AdvertLinkModel) {
    if (linkage?.url) return 'url';
    if (linkage?.linkedArticleId) return 'article';
    return 'none';
}

export default function AdvertRepository(): RepositoryContract<AdvertModel> {
    const apiService = Container.resolve(ApiService);
    const fileService = Container.resolve(FileService);

    async function getAll(): Promise<AdvertModel[] | null> {
        const { digiBanners } = await apiService.request(endpoints.getAdverts)
            .send<{ digiBanners: GetAdvertResponse[] }>();

        if (!digiBanners) {
            return null;
        }

        return Promise.all(
            digiBanners.map(async (advert): Promise<AdvertModel> => {
                const image: FileShape | null = advert.imageUrl
                    ? {
                        content: await fileService.urlToBase64(url.decache(advert.imageUrl)),
                        name: 'image.png',
                    }
                    : null;

                return {
                    ...advert,
                    name: advert.label,
                    startDate: date.unix(advert.dateStart),
                    endDate: date.unix(advert.dateFinal),
                    image,
                    linkType: retrieveAdvertLinkType(advert),
                };
            }),
        );
    }

    async function getById(id: number): Promise<AdvertModel | null> {
        const { digiBanner } = await apiService.request(endpoints.getAdvert)
            .send<{ digiBanner: GetAdvertResponse }>({ id });

        if (!digiBanner) {
            return null;
        }

        const image: FileShape | null = digiBanner.imageUrl
            ? {
                content: await fileService.urlToBase64(url.decache(digiBanner.imageUrl)),
                name: 'image.png',
            }
            : null;

        return {
            ...digiBanner,
            name: digiBanner.label,
            startDate: date.unix(digiBanner.dateStart),
            endDate: date.unix(digiBanner.dateFinal),
            image,
            linkType: retrieveAdvertLinkType(digiBanner),
        };
    }

    async function create(advert: AdvertModel): Promise<boolean> {
        const payload: Partial<CreateAdvertPayload> = {
            label: advert.name,
            dateStart: date.unix(advert.startDate),
            dateFinal: date.unix(advert.endDate),
            imageData: advert.image?.content,
            linkedArticleId: advert.linkedArticleId,
            linkedPage: advert.linkedPage,
            url: advert.url,
        };

        const { success } = await apiService.request(endpoints.createAdvert)
            .send<{ success: boolean }>(payload);

        return success || false;
    }

    async function update(advert: AdvertModel): Promise<boolean> {
        const payload: Partial<UpdateAdvertPayload> = {
            id: advert.id,
            label: advert.name,
            dateStart: advert.startDate ? date.unix(advert.startDate) : undefined,
            dateFinal: advert.endDate ? date.unix(advert.endDate) : undefined,
            imageData: advert.image?.content,
            linkedArticleId: advert.linkedArticleId,
            linkedPage: advert.linkedPage,
            url: advert.url,
            isLocked: advert.isLocked,
        };

        const { success } = await apiService.request(endpoints.updateAdvert)
            .send<{ success: boolean }>(payload);

        return success || false;
    }

    async function remove(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deleteAdvert)
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
