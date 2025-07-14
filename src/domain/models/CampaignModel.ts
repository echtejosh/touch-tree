import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';
import { CampaignGeoCoordinateModel } from 'domain/models/CampaignGeoCoordinateModel';

export interface CampaignModel {
    id: number;
    name: string;
    dateCreated?: number;
    startDate: Date | null;
    endDate: Date | null;
    isLocked: boolean;
    type: number;
    url: string | null;
    status: string;
    hasEmailAccess?: boolean;
    hasEmailAccessDirectToken?: boolean;
    hasEmailRegistration?: boolean;
    hasRegistrationDirectToken?: boolean;
    tokenTypeId?: number;
    linkedArticleId: number;
    linkedPage: number;
    geoId: number;
    advertIds: number[];
    adverts: Array<{
        id: number;
        imageUrl: string;
    }>;
    coordinates: Array<CampaignGeoCoordinateModel>;
    ips: Array<CampaignIpAddressModel>;
}
