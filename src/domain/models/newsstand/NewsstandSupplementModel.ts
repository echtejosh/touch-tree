import { FileShape } from 'domain/contracts/services/FileServiceContract';

export interface DocumentModel {
    id: number;
    categoryId: number | null;
    categoryLabel: string | null;
    name: string;
    dateCreated: Date | null;
    description: string | null;
    pages: number;
}

export interface CategoryModel {
    id: number;
    label: string;
}

export interface SupplementsModel {
    categories: CategoryModel[];
    documents: DocumentModel[];
}

export interface CreateDocumentModel {
    file: FileShape;
    label: string;
    categoryId: number;
}

export interface UpdateDocumentModel {
    id: number;
    label: string;
    categoryId: number | null;
}
