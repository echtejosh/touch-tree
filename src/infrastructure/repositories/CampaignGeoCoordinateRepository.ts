import { ApiService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import { CampaignGeoCoordinateModel } from 'domain/models/CampaignGeoCoordinateModel';
import { ApiResponse } from 'infrastructure/services/types';
import endpoints from '../routes/endpoints';

interface GetCampaignGeoCoordinatesResponse {
    campaignCoordinates: Array<{
        id: number,
        latitude: number,
        longitude: number,
        maxGeoMetres: number,
        locationLabel: string | null,
        campaignId: number,
    }>;
}

interface CreateGeoCoordinatesPayload {
    latitude: number,
    longitude: number,
    maxGeoMetres: number,
    label: string | null,
    campaignId: number,
}

interface UpdateGeoCoordinatesPayload {
    id: number,
    latitude: number,
    longitude: number,
    maxGeoMetres: number,
    label: string | null,
}

export default function CampaignGeoCoordinateRepository() {
    const apiService = Container.resolve(ApiService);

    async function getAll(id: number): Promise<CampaignGeoCoordinateModel[] | null> {
        const { campaignCoordinates } = await apiService.request(endpoints.getCoordinates)
            .send<GetCampaignGeoCoordinatesResponse>({ campaignId: id });

        if (!campaignCoordinates) {
            return null;
        }

        return campaignCoordinates.map((item) => {
            return {
                id: item.id,
                longitude: item.longitude,
                latitude: item.latitude,
                radius: item.maxGeoMetres,
                label: item.locationLabel,
                campaignId: item.campaignId,
            };
        });
    }

    async function getById(campaignId: number, id: number): Promise<CampaignGeoCoordinateModel | null> {
        const { campaignCoordinates } = await apiService.request(endpoints.getCoordinates)
            .send<GetCampaignGeoCoordinatesResponse>({ campaignId });
        console.log(campaignCoordinates);

        const item = campaignCoordinates?.find((val) => val.id === id);

        if (!item) {
            return null;
        }

        return {
            id: item.id,
            longitude: item.longitude,
            latitude: item.latitude,
            radius: item.maxGeoMetres,
            label: item.locationLabel,
            campaignId: item.campaignId,
        };
    }

    async function create(values: CampaignGeoCoordinateModel): Promise<boolean> {
        const payload: CreateGeoCoordinatesPayload = {
            campaignId: values.campaignId,
            label: values.label,
            latitude: values.latitude,
            longitude: values.longitude,
            maxGeoMetres: values.radius,
        };

        const { success } = await apiService.request(endpoints.createCoordinate)
            .send<ApiResponse>({ ...payload });

        return success || false;
    }

    async function update(values: CampaignGeoCoordinateModel): Promise<boolean> {
        const payload: UpdateGeoCoordinatesPayload = {
            id: values.id,
            latitude: values.latitude,
            longitude: values.longitude,
            maxGeoMetres: values.radius,
            label: values.label,
        };

        const { success } = await apiService.request(endpoints.updateCoordinate)
            .send<ApiResponse>({ ...payload });

        return success || false;
    }

    async function remove(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deleteCoordinate)
            .send<ApiResponse>({ id });

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
