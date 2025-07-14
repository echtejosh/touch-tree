export interface CampaignGeoCoordinateModel {
    id: number,
    latitude: number,
    longitude: number,
    radius: number,
    label: string | null,
    campaignId: number,
}
