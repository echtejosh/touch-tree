export interface CampaignIpAddressModel {
    id: number;
    label: string | null;
    ip: string;
    range: number;
    campaignId: number;
}
