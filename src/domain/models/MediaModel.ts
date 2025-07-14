export interface CategoryModel {
    id: number;
    label: string;
}

export interface MediaModel {
    branchName: string;
    dateCreated: number;
    departmentLabel: string;
    fullName: string;
    countryLabel: string;
    hasHtmlContent: boolean;
    hasSpeechContent: boolean;
    id: number;
    isLocked: boolean;
    mediaDescription: string;
    parentId: number | null;
    objectCategories: Array<{
        id: number;
        label: string;
    }> | null;
    latestBranchLowRes: string | null;
    publicationCoverImageMedium: string | null;
    publicationCoverImageThumb: string | null;
    publicationStatus: string;
    quantityPages: number;
    rootName: string;
    isNewspaper: boolean;
}
