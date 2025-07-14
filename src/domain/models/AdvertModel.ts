import { FileShape } from 'domain/contracts/services/FileServiceContract';

export type AdvertLinkType = 'url' | 'article' | 'none';

export interface AdvertModel {
    id: number;
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    image: FileShape | null;
    linkedCampaigns: Array<{
        id: number;
        campaignId: number;
        campaignLabel: string;
    }>;
    linkedArticleId: number | null;
    linkedPage: number | null;
    url: string | null;
    isLocked: boolean;
    status: string;
    linkType: AdvertLinkType /* custom-made property at the repository level to determine link type */
}

export interface AdvertLinkModel {
    linkedArticleId: number | null,
    url: string | null;
}
