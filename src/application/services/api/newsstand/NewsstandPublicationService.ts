import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import {
    ArticleModel,
    NewsstandPublicationModel,
    NewsstandPublicationPageModel,
    NewsstandPublicationPagesModel,
    PublicationDescriptionModel,
    PublicationPageReferenceModel,
} from 'domain/models/newsstand/NewsstandPublicationModel';
import endpoints from 'infrastructure/routes/endpoints';
import date from 'utils/date';
import str from 'utils/str';
import { PublicationInteraction, PublicationInteractions } from 'domain/models/PublicationInteraction';
import { ApiResponse } from 'infrastructure/services/types';

interface GetPublicationResponse {
    id: number;
    description: string;
    name: string;
    branches: Array<{
        id: number;
        fullName: string;
        name: string;
        dateCreated: number;
        dateStart: number;
        status: string;
        quantityPages: number;
        hasHtml: boolean;
        hasSpeech: boolean;
        imageMedium: string;
        imageThumb: string;
        isLocked: boolean;
    }>;
}

interface GetPublicationInteractionsResponse {
    publicationInteractions: {
        effects: Array<{ id: number, label: string }>;
        interactions: Array<{
            id: number;
            pageId: number;
            page: number;
            label: string;
            percentageTop: number;
            percentageLeft: number;
            percentageBottom: number;
            percentageRight: number;
            url: string | null;
            linkedArticleId: number | null;
            linkedPage: number;
            email: string | null;
            telephone: string | null;
            urlEmbedded: string | null;
            isEmbeddedViaServer: boolean;
            publicationLinkageType: string;
            effectId: number;
            effectLabel: string;
        }>,
        quantityPages: number;
    };
}

interface GetPublicationInteractionResponse {
    publicationInteraction: {
        id: number;
        pageId: number;
        page: number;
        label: string;
        percentageTop: number;
        percentageLeft: number;
        percentageBottom: number;
        percentageRight: number;
        url: string | null;
        linkedArticleId: number | null;
        linkedPage: number;
        email: string | null;
        telephone: string | null;
        urlEmbedded: string | null;
        isEmbeddedViaServer: boolean;
        publicationLinkageType: string;
        effectId: number;
        effectLabel: string;
    };
}

interface GetPublicationPageResponse {
    publicationArticle: {
        articleId: number;
        branchName: string;
        contentDoc: string;
        contentHtml: string;
        createdBy: number;
        dateCreated: number;
        dateModified: number;
        hasExternalStorage: boolean;
        hasHtmlVersion: boolean;
        hasSpeechVersion: boolean;
        htmlLinkedPage: number;
        htmlVersion: {
            baseName: string;
            fileSize: string;
            path: string;
        };
        html: string;
        id: number;
        imageData: string;
        imageMediumRes: string;
        modifiedBy: number;
        page: number;
        publication: string;
        rootName: string;
        title: string;
    };
}

interface GetPublicationPagesResponse {
    publicationPages: Array<{
        articleId: number;
        branchName: string;
        dateCreated: number;
        fullName: string;
        hasExternalStorage: boolean;
        hasHtmlVersion: boolean;
        htmlLinkedPage: number;
        hasSpeechVersion: boolean;
        htmlAudioPath: string;
        htmlFilePath: string;
        id: number;
        imageLowRes: string;
        imageMediumRes: string;
        imageHighRes: string;
        page: number;
        publication: string;
    }>;
}

interface GetArticleResponse {
    digiArticle: {
        id: number;
        isLocked: boolean;
    };
}

interface UpdatePublicationDescriptionPayload {
    id: number;
    mediaDescription: string;
}

interface UpdateArticlePayload {
    id: number;
    isLocked: boolean;
}

// interface UpdatePublicationPagePayload {
//     publicationHtml: Partial<{
//         articleId: number;
//         page: number;
//         html: string | null;
//     }>
// }

interface GetPublicationArticlePayload {
    articleId: number;
    page: number;
}

export default function NewsstandPublicationService() {
    const apiService = Container.resolve(ApiService);

    async function getPublications(): Promise<NewsstandPublicationModel[] | null> {
        const { publications } = await apiService.request(endpoints.getPublications)
            .send<{ publications: GetPublicationResponse[] }>();

        if (!publications) {
            return null;
        }

        return publications.map((publication) => ({
            id: publication.id,
            description: publication.description,
            name: publication.name,
            articles: publication.branches.map((branch) => ({
                id: branch.id,
                publicationId: publication.id,
                publicationName: publication.name,
                fullName: branch.fullName,
                name: branch.name || branch.fullName,
                releaseDate: date.unix(branch.dateStart),
                status: branch.status,
                quantityPages: branch.quantityPages,
                hasHtml: branch.hasHtml,
                hasSpeech: branch.hasSpeech,
                imageMedium: branch.imageMedium,
                imageThumb: branch.imageThumb,
                isLocked: branch.isLocked,
            })),
        }));
    }

    async function updatePublicationDescription(values: PublicationDescriptionModel): Promise<boolean> {
        const payload: UpdatePublicationDescriptionPayload = {
            id: values.id,
            mediaDescription: values.description,
        };

        const { success } = await apiService.request(endpoints.updatePublicationArticle)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    async function getPublicationPage(publication: PublicationPageReferenceModel): Promise<NewsstandPublicationPageModel | null> {
        if (!publication?.linkedPage || !publication.linkedArticleId) return null;

        const payload: GetPublicationArticlePayload = {
            articleId: publication.linkedArticleId,
            page: publication.linkedPage,
        };

        const { publicationArticle: publicationPage } = await apiService.request(endpoints.getPublicationArticle)
            .send<GetPublicationPageResponse>({ ...payload });

        if (!publicationPage) {
            return null;
        }

        return {
            ...publicationPage,
            html: str.decodeBase64(publicationPage.html), /* base64 decoding method applied, since the html value is base64 encoded string */
        };
    }

    async function getPublicationPages(publicationId: number): Promise<NewsstandPublicationPagesModel[] | null> {
        if (!publicationId) {
            return null;
        }

        const { publicationPages } = await apiService.request(endpoints.getPublicationPages)
            .send<GetPublicationPagesResponse>({ articleId: publicationId });

        if (!publicationPages) {
            return null;
        }

        return publicationPages.sort((a, b) => a.page - b.page);
    }

    async function updatePublicationPage(values: Partial<NewsstandPublicationPageModel>): Promise<boolean> {
        const payload = {
            articleId: values.articleId,
            page: values.page,
            html: values.html ? str.encodeToBase64(values.html) : null, /* encodes html content into base64 (required by the server) */
        };

        const { success } = await apiService.request(endpoints.updatePublicationPage)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    async function getArticle(id: number): Promise<Partial<ArticleModel> | null> {
        const { digiArticle } = await apiService.request(endpoints.getArticle)
            .send<GetArticleResponse>({ articleId: id });

        if (!digiArticle) {
            return null;
        }

        return digiArticle;
    }

    async function updateArticle(values: Partial<ArticleModel>): Promise<boolean> {
        const payload: Partial<UpdateArticlePayload> = values;

        const { success } = await apiService.request(endpoints.updateArticle)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    async function getInteractions(id: number, page: number): Promise<PublicationInteractions | null> {
        const { publicationInteractions } = await apiService.request(endpoints.getPublicationInteractions)
            .send<GetPublicationInteractionsResponse>({ articleId: id, page });

        if (!publicationInteractions) {
            return null;
        }

        return publicationInteractions;
    }

    async function getInteraction(id: number): Promise<PublicationInteraction | null> {
        const { publicationInteraction } = await apiService.request(endpoints.getPublicationInteraction)
            .send<GetPublicationInteractionResponse>({ id });

        if (!publicationInteraction) {
            return null;
        }

        return publicationInteraction;
    }

    async function createInteraction(values: PublicationInteraction): Promise<number | null> {
        const { interactionId } = await apiService.request(endpoints.createPublicationInteraction)
            .send<{ interactionId: number | null }>({ ...values });

        return interactionId || null;
    }

    async function updateInteraction(values: Partial<PublicationInteraction>): Promise<boolean> {
        const { success } = await apiService.request(endpoints.updatePublicationInteraction)
            .send<ApiResponse>(values);

        return success || false;
    }

    async function deleteInteraction(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deletePublicationInteraction)
            .send<ApiResponse>({ id });

        return success || false;
    }

    return {
        getInteractions,
        getInteraction,
        createInteraction,
        updateInteraction,
        deleteInteraction,
        getPublications,
        updatePublicationDescription,
        updatePublicationPage,
        getPublicationPage,
        getPublicationPages,
        getArticle,
        updateArticle,
    };
}
