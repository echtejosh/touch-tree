import { FileShape } from 'domain/contracts/services/FileServiceContract';

export const AdvertType = {
    Banner: 1,
    Footer: 2,
    Inline: 3,
} as const;

export type AdvertTypes = typeof AdvertType[keyof typeof AdvertType];

export interface RelationAdvertType {
    id: number;
    label: string;
}

export type RelationAdvertLinkType = 'url' | 'article' | 'none';

export interface RelationAdvertModel {
    id: number;
    isLocked: boolean;
    startDate: Date | null;
    endDate: Date | null;
    linkedArticleId: number | null;
    linkedPage: number | null;
    url: string | null;
    status: string;
    image: FileShape | null;
    linkType: RelationAdvertLinkType;
    typeId: number;
    typeLabel: string;
    relationId?: number;
    inlineAdvertIntervalSeconds: number | null;
}

export interface RelationAdvertLinkModel {
    linkedArticleId: number | null,
    url: string | null;
}

export interface RelationAdvertWithTypes {
    advert: RelationAdvertModel;
    advertTypes: RelationAdvertType[];
}
