import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import endpoints from 'infrastructure/routes/endpoints';
import { CategoryModel, MediaModel } from 'domain/models/MediaModel';
import { ApiResponse } from 'infrastructure/services/types';

interface GetPodcastsResponse {
    podcasts: {
        articles: Array<{
            branchName: string;
            dateCreated: number;
            departmentLabel: string;
            fullName: string;
            hasHtmlContent: boolean;
            hasSpeechContent: boolean;
            id: number;
            isLocked: boolean;
            mediaDescription: string;
            countryLabel: string;
            parentId: number | null;
            latestBranchLowRes: string | null;
            objectCategories: Array<{
                id: number;
                label: string;
            }> | null;
            publicationCoverImageMedium: string | null;
            publicationCoverImageThumb: string | null;
            publicationStatus: string;
            quantityPages: number;
            rootName: string;
            isNewspaper: boolean;
        }>,
        categories: Array<{
            id: number;
            label: string;
        }>
    };
}

interface GetMediaItemResponse {
    digiLockedArticle: {
        isLocked: boolean;
        id: number;
        departmentId: number;
        label: string;
        createdBy: number;
        modifiedBy: number;
        dateCreated: number;
        dateModified: number;
        groupId: number;
    };
}

export default function PodcastsService() {
    const apiService = Container.resolve(ApiService);

    async function getPodcasts(): Promise<MediaModel[] | null> {
        const { podcasts } = await apiService.request(endpoints.getPodcasts)
            .send<GetPodcastsResponse>();

        if (!podcasts.articles) {
            return null;
        }

        return podcasts.articles;
    }

    async function getPodcast(articleId: number): Promise<Partial<MediaModel> | null> {
        const { digiLockedArticle } = await apiService.request(endpoints.getMediaItem)
            .send<GetMediaItemResponse>({ articleId });

        if (!digiLockedArticle) {
            return null;
        }

        return digiLockedArticle;
    }

    async function updatePodcast(values: Partial<MediaModel>): Promise<boolean> {
        const { success } = await apiService.request(endpoints.updatePodcast)
            .send<ApiResponse>({
                articleId: values.id,
                isLocked: values.isLocked,
            });

        return Boolean(success);
    }

    async function getPodcastCategories(): Promise<CategoryModel[] | null> {
        const { podcasts } = await apiService.request(endpoints.getPodcasts)
            .send<GetPodcastsResponse>();

        if (!podcasts.categories) {
            return null;
        }

        return podcasts.categories;
    }

    return {
        getPodcasts,
        getPodcast,
        updatePodcast,
        getPodcastCategories,
    };
}
