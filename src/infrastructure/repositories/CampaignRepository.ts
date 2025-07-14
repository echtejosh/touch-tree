import { RepositoryContract } from 'domain/contracts/repository/RepositoryContract';
import { CampaignModel } from 'domain/models/CampaignModel';
import { ApiService } from 'infrastructure/services';
import { ApiResponse } from 'infrastructure/services/types';
import Container from 'infrastructure/services/Container';
import endpoints from '../routes/endpoints';
import date from '../../utils/date';

interface GetCampaignResponse {
    quantityGeoLocations: number;
    quantityIpAddresses: number;
    type: number;
    accessDigiUrl: string;
    dateStart: number | null;
    dateFinal: number | null;
    isLocked: boolean;
    banners: Array<{
        id: number;
        imageUrl: string;
    }> | null;
    objectCoordinates: Array<{
        id: number;
        label: string | null;
        latitude: number;
        longitude: number;
        maxGeoMetres: number;
        campaignId: number;
    }> | null;
    objectIpAddresses: Array<{
        id: number;
        label: string | null;
        ip: string;
        ipMask: number;
        campaignId: number;
    }> | null;
    id: number;
    departmentId: number;
    label: string;
    dateCreated: number;
    isActive: boolean;
    status: string;
    linkedArticleId: number,
    linkedPage: number,
    geoId: number;
    tokenTypeId: number;
    hasEmailAccess: boolean;
    hasEmailAccessDirectToken: boolean;
    hasEmailRegistration: boolean;
    hasRegistrationDirectToken: boolean;
}

interface UpdateCampaignPayload {
    dateFinal: number | null;
    dateStart: number | null;
    geoId: number;
    hasEmailAccess: boolean;
    hasEmailAccessDirectToken: boolean;
    hasEmailRegistration: boolean;
    hasRegistrationDirectToken: boolean;
    id: number;
    label: string;
    linkedArticleId: number;
    linkedPage: number;
    listBannerId: number[];
    tokenTypeId: number;
    isLocked: boolean;
}

interface CreateCampaignPayload {
    dateFinal: number | null;
    dateStart: number | null;
    hasEmailAccess: boolean;
    hasEmailAccessDirectToken: boolean;
    hasEmailRegistration: boolean;
    hasRegistrationDirectToken: boolean;
    label: string;
    linkedArticleId: number;
    linkedPage: number;
    listBannerId: number[];
    tokenTypeId: number;
}

interface CampaignRepositoryContract {
    create(values: CampaignModel): Promise<null | number | ApiResponse>;
    update(values: CampaignModel): Promise<ApiResponse>;
}

export default function CampaignRepository(): RepositoryContract<CampaignModel, CampaignRepositoryContract> {
    const apiService = Container.resolve(ApiService);

    async function getAll(): Promise<CampaignModel[] | null> {
        const { digiCampaigns } = await apiService.request(endpoints.getCampaigns)
            .send<{ digiCampaigns: GetCampaignResponse[] }>();

        if (!digiCampaigns) {
            return null;
        }

        return Promise.all(
            digiCampaigns.map(async (campaign): Promise<CampaignModel> => {
                return {
                    id: campaign.id,
                    name: campaign.label,
                    startDate: date.unix(campaign.dateStart),
                    endDate: date.unix(campaign.dateFinal),
                    isLocked: campaign.isLocked,
                    type: campaign.type,
                    url: campaign.accessDigiUrl,
                    status: campaign.status,
                    linkedArticleId: campaign.linkedArticleId,
                    linkedPage: campaign.linkedPage,
                    geoId: campaign.geoId,
                    adverts: campaign.banners || [],
                    advertIds: campaign.banners?.map((item) => item.id) || [],
                    coordinates: campaign.objectCoordinates?.map((item) => {
                        return {
                            id: item.id,
                            label: item.label,
                            radius: item.maxGeoMetres,
                            longitude: item.longitude,
                            latitude: item.latitude,
                            campaignId: item.campaignId,
                        };
                    }) || [],
                    ips: campaign.objectIpAddresses?.map((item) => {
                        return {
                            id: item.id,
                            label: item.label,
                            ip: item.ip,
                            range: item.ipMask,
                            campaignId: item.campaignId,
                        };
                    }) || [],
                };
            }),
        );
    }

    async function getById(id: number): Promise<CampaignModel | null> {
        const { digiCampaign: campaign } = await apiService.request(endpoints.getCampaign)
            .send<{ digiCampaign: GetCampaignResponse }>({ campaignId: id });

        if (!campaign) {
            return null;
        }

        return {
            id: campaign.id,
            name: campaign.label,
            dateCreated: campaign.dateCreated,
            startDate: date.unix(campaign.dateStart),
            endDate: date.unix(campaign.dateFinal),
            isLocked: campaign.isLocked,
            type: campaign.type,
            url: campaign.accessDigiUrl,
            status: campaign.status,
            tokenTypeId: campaign.tokenTypeId,
            adverts: campaign.banners || [],
            advertIds: campaign.banners?.map((item) => item.id) || [],
            linkedArticleId: campaign.linkedArticleId,
            linkedPage: campaign.linkedPage,
            hasEmailAccess: campaign.hasEmailAccess,
            hasEmailRegistration: campaign.hasEmailRegistration,
            geoId: campaign.geoId,
            coordinates: campaign.objectCoordinates?.map((item) => {
                return {
                    id: item.id,
                    label: item.label,
                    radius: item.maxGeoMetres,
                    longitude: item.longitude,
                    latitude: item.latitude,
                    campaignId: campaign.id,
                };
            }) || [],
            ips: campaign.objectIpAddresses?.map((item) => {
                return {
                    id: item.id,
                    label: item.label,
                    ip: item.ip,
                    range: item.ipMask,
                    campaignId: campaign.id,
                };
            }) || [],
        };
    }

    async function create(values: CampaignModel): Promise<null | number | ApiResponse> {
        const payload: Partial<CreateCampaignPayload> = {
            label: values.name,
            hasEmailAccess: values.hasEmailAccess,
            hasEmailRegistration: values.hasEmailRegistration,
            tokenTypeId: values.tokenTypeId,
            linkedArticleId: values.linkedArticleId,
            linkedPage: values.linkedPage,
            dateStart: date.unix(values.startDate),
            dateFinal: date.unix(values.endDate),
            hasEmailAccessDirectToken: true,
            hasRegistrationDirectToken: true,
            listBannerId: values.advertIds,
        };

        const response = await apiService.request(endpoints.createCampaign)
            .send<{ campaignId: number } & ApiResponse>(payload);

        if (!response.success) {
            return {
                serverStatus: response.serverStatus,
                success: false,
            };
        }

        return response.campaignId || null;
    }

    async function update(campaign: CampaignModel): Promise<ApiResponse> {
        const payload: Partial<UpdateCampaignPayload> = {
            id: campaign.id,
            geoId: campaign.geoId,
            label: campaign.name,
            listBannerId: campaign.advertIds,
            hasEmailAccess: campaign.hasEmailAccess,
            hasEmailRegistration: campaign.hasEmailRegistration,
            tokenTypeId: campaign.tokenTypeId,
            linkedArticleId: campaign.linkedArticleId,
            linkedPage: campaign.linkedPage,
            dateStart: campaign.startDate ? date.unix(campaign.startDate) : undefined,
            dateFinal: campaign.endDate ? date.unix(campaign.endDate) : undefined,
            hasEmailAccessDirectToken: true,
            hasRegistrationDirectToken: true,
            isLocked: campaign.isLocked,
        };

        return apiService.request(endpoints.updateCampaign).send<ApiResponse>(payload);
    }

    async function remove(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.updateCampaign)
            .send<{ success: boolean }>({
                id,
                isArchived: true,
            });

        return success || false;
    }

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
}
