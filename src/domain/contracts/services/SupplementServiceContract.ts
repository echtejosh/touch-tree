import {
    CreateDocumentModel,
    SupplementsModel,
    UpdateDocumentModel,
} from 'domain/models/newsstand/NewsstandSupplementModel';
import { ApiResponse } from 'infrastructure/services/types';

export interface SupplementCategory {
    id: number,
    label: string,
}

/**
 * Contract for the NewsstandSupplementService.
 */
export interface SupplementServiceContract {
    /**
     * Fetches the supplement data from the API.
     *
     * @returns A promise that resolves to the colors data or `null` if not found.
     */
    getSupplements(): Promise<SupplementsModel | null>

    createDocument(document: CreateDocumentModel): Promise<boolean>

    updateDocument(document: UpdateDocumentModel): Promise<boolean>

    removeDocument(id: number): Promise<ApiResponse>

    createCategory(label: string): Promise<boolean>

    updateCategory(values: SupplementCategory): Promise<boolean>

    removeCategory(id: number): Promise<boolean>
}
