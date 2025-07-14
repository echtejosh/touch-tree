import { FileShape } from 'domain/contracts/services/FileServiceContract';

export interface EditorColorsModel {
    pageBackgroundColor: string;
    pageFontColor: string;
    pageHighlightColor: string;
    headerBackgroundColor: string;
    headerFontColor: string;
    footerBackgroundColor: string;
    footerFontColor: string;
    cardBackgroundColor: string;
    cardFontColor: string;
    separatorColor: string;
}

export interface EditorLogoModel {
    logoFile: FileShape | null;
    logoShrinkage?: number | null;
    logoLinkUrl: string | null;
}

export interface EditorSidebarModel {
    title: string | null;
    sidebarBackgroundImg: FileShape | null;
}

export interface EditorWebsiteModel {
    title: string | null;
    favicon: FileShape | null;
}

export interface EditorPodsSettingsModel {
    hasRoundedEdges: boolean;
}

export interface LinkageModel {
    url: string | null;
    articleId: number | null;
    documentId: number | null;
    page: number | null;
    type: LinkageType;
}

export type LinkageType = 'url' | 'article' | 'document' | 'none';

export interface EditorPodModel {
    imgSrc: FileShape | null;
    linkage: LinkageModel;
}

// interface CategoryModel {
//     id: number;
//     label: string;
// }
