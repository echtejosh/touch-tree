import { FileShape } from 'domain/contracts/services/FileServiceContract';

export interface HighlightModel {
    id: number;
    isLocked: boolean;
    startDate: Date | null;
    endDate: Date | null;
    isHighlight: boolean;
    isArchived: boolean,
    linkedCampaigns: Array<{
        id: number;
        campaignId: number;
        campaignLabel: string;
    }>;
    url: string | null;
    linkedArticleId: number | null,
    linkedPage: number | null,
    title: string | null,
    subtitle: string | null,
    tagline: string | null,
    status: string;
    image: FileShape | null;
    customImage?: FileShape | null;
}
