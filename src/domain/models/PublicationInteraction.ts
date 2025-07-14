export interface PublicationInteraction {
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
    linkedPage: number | null;
    email: string | null;
    telephone: string | null;
    urlEmbedded: string | null;
    isEmbeddedViaServer: boolean;
    publicationLinkageType: string;
    effectId: number;
    effectLabel: string;
}

export interface PublicationInteractionEffect {
    id: number;
    label: string;
}

export interface PublicationInteractions {
    effects: PublicationInteractionEffect[];
    interactions: PublicationInteraction[] | null;
    quantityPages: number;
}
