import Container from 'infrastructure/services/Container';
import endpoints from 'infrastructure/routes/endpoints';
import { ApiService } from 'infrastructure/services';
import {
    CreateDocumentModel,
    SupplementsModel,
    UpdateDocumentModel,
} from 'domain/models/newsstand/NewsstandSupplementModel';
import { ApiResponse } from 'infrastructure/services/types';
import date from 'utils/date';
import { SupplementCategory, SupplementServiceContract } from 'domain/contracts/services/SupplementServiceContract';

interface GetPrivatePublicationsResponse {
    categories: Array<{
        id: number;
        label: string;
    }>;
    documents: Array<{
        id: number;
        label: string;
        dateCreated: number;
        categoryId: number;
        categoryLabel: string;
        description: string | null;
        publicationCoverImageMedium: string | null;
        publicationCoverImageThumb: string | null;
        quantityProcessedContent: number;
    }>;
}

export interface CreateDocumentPayload {
    file: string;
    fileName: string;
    label: string;
    categoryId: number;
}

export interface RemoveDocumentPayload {
    id: number;
    isArchived: boolean; /* mandatory prop to 'remove' document  */
}

export default function NewsstandSupplementService(): SupplementServiceContract {
    const apiService = Container.resolve(ApiService);

    async function getSupplements(): Promise<SupplementsModel | null> {
        const { privatePublications } = await apiService.request(endpoints.getSupplements)
            .send<{ privatePublications: GetPrivatePublicationsResponse }>();

        if (!privatePublications) {
            return null;
        }

        const {
            categories: _categories,
            documents: _documents,
        } = privatePublications;

        const categories = _categories || [];
        const documents = _documents || [];

        const normalizedDocs = documents.map((document) => ({
            id: document.id,
            categoryId: document.categoryId,
            categoryLabel: document.categoryLabel,
            name: document.label.toString(),
            dateCreated: date.unix(document.dateCreated),
            description: document.description,
            pages: document.quantityProcessedContent,
        }));

        return {
            categories,
            documents: normalizedDocs,
        };
    }

    async function createDocument(document: CreateDocumentModel): Promise<boolean> {
        const payload: CreateDocumentPayload = {
            ...document,
            file: document.file.content,
            fileName: document.file.name,
        };

        const { success } = await apiService.request(endpoints.createSupplement)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    async function updateDocument(document: UpdateDocumentModel): Promise<boolean> {
        const { success } = await apiService.request(endpoints.updateSupplement)
            .send<{ success: boolean }>({ ...document });

        return success || false;
    }

    async function removeDocument(id: number): Promise<ApiResponse> {
        const payload: RemoveDocumentPayload = {
            id,
            isArchived: true,
        };

        return apiService.request(endpoints.updateSupplement)
            .send<ApiResponse>({ ...payload });
    }

    async function createCategory(label: string): Promise<boolean> {
        const { success } = await apiService.request(endpoints.createSupplementCategory)
            .send<{ success: boolean }>({ label });

        return success || false;
    }

    async function updateCategory(values: SupplementCategory): Promise<boolean> {
        const { success } = await apiService.request(endpoints.updateSupplementCategory)
            .send<{ success: boolean }>({ ...values });

        return success || false;
    }

    async function removeCategory(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deleteSupplementCategory)
            .send<{ success: boolean }>({ id });

        return success || false;
    }

    return {
        getSupplements,
        createDocument,
        updateDocument,
        removeDocument,
        createCategory,
        updateCategory,
        removeCategory,
    };
}
