import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import endpoints from 'infrastructure/routes/endpoints';
import { CategoryModel, MediaModel } from 'domain/models/MediaModel';
import { ApiResponse } from 'infrastructure/services/types';

interface GetMediaResponse {
    publicationBlocklist: {
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

export default function MediaService() {
    const apiService = Container.resolve(ApiService);

    async function getMedia(): Promise<MediaModel[] | null> {
        const { publicationBlocklist } = await apiService.request(endpoints.getMedia)
            .send<GetMediaResponse>();

        if (!publicationBlocklist.articles) {
            return null;
        }

        return publicationBlocklist.articles;
    }

    async function getMediaItem(articleId: number): Promise<Partial<MediaModel> | null> {
        const { digiLockedArticle } = await apiService.request(endpoints.getMediaItem)
            .send<GetMediaItemResponse>({ articleId });

        if (!digiLockedArticle) {
            return null;
        }

        return digiLockedArticle;
    }

    async function updateMedia(values: Partial<MediaModel>): Promise<boolean> {
        const { success } = await apiService.request(endpoints.updateMedia)
            .send<ApiResponse>({
                articleId: values.id,
                isLocked: values.isLocked,
            });

        return Boolean(success);
    }

    async function getCategories(): Promise<CategoryModel[] | null> {
        const { publicationBlocklist } = await apiService.request(endpoints.getMedia)
            .send<GetMediaResponse>();

        if (!publicationBlocklist.categories) {
            return null;
        }

        return publicationBlocklist.categories;
    }

    return {
        getMedia,
        getMediaItem,
        updateMedia,
        getCategories,
    };
}
