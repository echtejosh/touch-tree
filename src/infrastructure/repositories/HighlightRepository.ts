import { RepositoryContract } from 'domain/contracts/repository/RepositoryContract';
import { HighlightModel } from 'domain/models/HighlightModel';
import { ApiService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import FileService from 'application/services/FileService';
import endpoints from '../routes/endpoints';
import url from '../../utils/url';
import date from '../../utils/date';

interface GetHighlightResponse {
    id: number;
    isLocked: boolean;
    dateStart: number | null;
    dateFinal: number | null;
    isHighlight: boolean;
    isArchived: boolean,
    linkedCampaigns: Array<{
        id: number;
        campaignId: number;
        campaignLabel: string;
    }>;
    url: string | null;
    linkedArticleId: number | null;
    highlightTitle1: string | null,
    highlightTitle2: string | null,
    highlightTitle3: string | null,
    linkedPage: number;
    status: string;
    imageUrl: string;
}

interface UpdateHighlightPayload {
    id: number;
    dateStart: number | null;
    dateFinal: number | null;
    imageData: string,
    isLocked: boolean,
    highlightTitle1: string | null,
    highlightTitle2: string | null,
    highlightTitle3: string | null,
    linkedArticleId: number | null;
    linkedPage: number | null;
    url: string | null;
}

interface CreateHighlightPayload {
    dateStart: number | null;
    dateFinal: number | null;
    imageData: string,
    highlightTitle1: string | null,
    highlightTitle2: string | null,
    highlightTitle3: string | null,
    linkedArticleId: number | null;
    linkedPage: number | null;
    url: string | null;
    isHighlight: boolean;
    isLocked: boolean,
}

export default function HighlightRepository(): RepositoryContract<HighlightModel> {
    const apiService = Container.resolve(ApiService);
    const fileService = Container.resolve(FileService);

    async function getAll(): Promise<HighlightModel[] | null> {
        const { digiBanners } = await apiService.request(endpoints.getHighlights)
            .send<{ digiBanners: GetHighlightResponse[] }>();

        if (!digiBanners) {
            return null;
        }

        return Promise.all(
            digiBanners.map(async (highlight): Promise<HighlightModel> => {
                const image: FileShape | null = highlight.imageUrl
                    ? {
                        content: await fileService.urlToBase64(url.decache(highlight.imageUrl)),
                        name: 'image.png',
                    }
                    : null;

                // console.log(highlight);

                return {
                    ...highlight,
                    title: highlight.highlightTitle1,
                    subtitle: highlight.highlightTitle2,
                    tagline: highlight.highlightTitle3,
                    startDate: date.unix(highlight.dateStart),
                    endDate: date.unix(highlight.dateFinal),
                    image,
                };
            }),
        );
    }

    async function getById(id: number): Promise<HighlightModel | null> {
        const { digiBanner } = await apiService.request(endpoints.getHighlight)
            .send<{ digiBanner: GetHighlightResponse }>({ id });

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
            title: digiBanner.highlightTitle1,
            subtitle: digiBanner.highlightTitle2,
            tagline: digiBanner.highlightTitle3,
            startDate: date.unix(digiBanner.dateStart),
            endDate: date.unix(digiBanner.dateFinal),
            image,
        };
    }

    async function create(highlight: HighlightModel): Promise<boolean> {
        const payload: Partial<CreateHighlightPayload> = {
            dateStart: date.unix(highlight.startDate),
            dateFinal: date.unix(highlight.endDate),
            imageData: highlight.image?.content,
            highlightTitle1: highlight.title,
            highlightTitle2: highlight.subtitle,
            highlightTitle3: highlight.tagline,
            isLocked: highlight.isLocked,
            linkedArticleId: highlight.linkedArticleId,
            linkedPage: highlight.linkedPage,
            url: highlight.url,
            isHighlight: true,
        };

        const { success } = await apiService.request(endpoints.createHighlight)
            .send<{ success: boolean }>(payload);

        return success || false;
    }

    async function update(highlight: HighlightModel): Promise<boolean> {
        const payload: Partial<UpdateHighlightPayload> = {
            id: highlight.id,
            dateStart: highlight.startDate ? date.unix(highlight.startDate) : undefined,
            dateFinal: highlight.endDate ? date.unix(highlight.endDate) : undefined,
            imageData: highlight.image?.content,
            highlightTitle1: highlight.title,
            highlightTitle2: highlight.subtitle,
            highlightTitle3: highlight.tagline,
            isLocked: highlight.isLocked,
            linkedArticleId: highlight.linkedArticleId,
            linkedPage: highlight.linkedPage,
            url: highlight.url,
        };

        const { success } = await apiService.request(endpoints.updateHighlight)
            .send<{ success: boolean }>(payload);

        return success || false;
    }

    async function remove(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deleteHighlight)
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
