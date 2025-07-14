export interface ArticleModel {
    id: number;
    publicationId: number;
    publicationName: string;
    fullName: string;
    name: string;
    releaseDate: Date | null;
    status: string;
    quantityPages: number;
    hasHtml: boolean;
    hasSpeech: boolean;
    imageMedium: string;
    imageThumb: string;
    isLocked?: boolean;
}

export interface NewsstandPublicationModel {
    id: number;
    description: string;
    name: string;
    articles: ArticleModel[];
}

export interface NewsstandPublicationPageModel {
    articleId: number;
    branchName: string;
    contentDoc: string;
    contentHtml: string | null;
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
    } | null;
    html: string | null;
    id: number;
    imageData: string;
    imageMediumRes: string;
    modifiedBy: number;
    page: number;
    publication: string;
    rootName: string;
    title: string;
}

export interface NewsstandPublicationPagesModel {
    articleId: number;
    branchName: string;
    dateCreated: number;
    fullName: string;
    hasExternalStorage: boolean;
    hasHtmlVersion: boolean;
    hasSpeechVersion: boolean;
    htmlAudioPath: string;
    htmlFilePath: string;
    htmlLinkedPage: number;
    id: number;
    imageLowRes: string;
    imageMediumRes: string;
    imageHighRes: string;
    page: number;
    publication: string;
}

export interface PublicationDescriptionModel {
    id: number;
    description: string;
    name: string;
}

export interface PublicationPageReferenceModel {
    linkedArticleId?: number | null;
    linkedPage?: number | null;
}
