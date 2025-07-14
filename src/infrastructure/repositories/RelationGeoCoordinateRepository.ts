import { ApiService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import { RelationCoordinateModel } from 'domain/models/RelationCoordinateModel';
import { ApiResponse } from 'infrastructure/services/types';
import endpoints from '../routes/endpoints';

interface GetCampaignGeoCoordinatesResponse {
    relationCoordinates: Array<{
        id: number,
        latitude: number,
        longitude: number,
        maxGeoMetres: number,
        label: string | null,
    }>;
}

interface GetCampaignGeoCoordinateResponse {
    relationCoordinate: {
        id: number,
        latitude: number,
        longitude: number,
        maxGeoMetres: number,
        label: string | null,
    };
}

interface CreateGeoCoordinatesPayload {
    latitude: number,
    longitude: number,
    maxGeoMetres: number,
    label: string | null,
}

interface UpdateGeoCoordinatesPayload {
    id: number,
    latitude: number,
    longitude: number,
    maxGeoMetres: number,
    label: string | null,
}

export default function RelationGeoCoordinateRepository() {
    const apiService = Container.resolve(ApiService);

    async function getAll(): Promise<RelationCoordinateModel[] | null> {
        const { relationCoordinates } = await apiService.request(endpoints.getRelationCoordinates)
            .send<GetCampaignGeoCoordinatesResponse>();

        if (!relationCoordinates) {
            return null;
        }

        return relationCoordinates.map((item) => {
            return {
                id: item.id,
                longitude: item.longitude,
                latitude: item.latitude,
                radius: item.maxGeoMetres,
                label: item.label,
            };
        });
    }

    async function getById(id: number): Promise<RelationCoordinateModel | null> {
        const { relationCoordinate } = await apiService.request(endpoints.getRelationCoordinate)
            .send<GetCampaignGeoCoordinateResponse>({ id });

        if (!relationCoordinate) {
            return null;
        }

        return {
            id: relationCoordinate.id,
            longitude: relationCoordinate.longitude,
            latitude: relationCoordinate.latitude,
            radius: relationCoordinate.maxGeoMetres,
            label: relationCoordinate.label,
        };
    }

    async function create(values: RelationCoordinateModel): Promise<boolean> {
        const payload: CreateGeoCoordinatesPayload = {
            label: values.label,
            latitude: values.latitude,
            longitude: values.longitude,
            maxGeoMetres: values.radius,
        };

        const { success } = await apiService.request(endpoints.createRelationCoordinate)
            .send<ApiResponse>({ ...payload });

        return success || false;
    }

    async function update(values: RelationCoordinateModel): Promise<boolean> {
        const payload: UpdateGeoCoordinatesPayload = {
            id: values.id,
            latitude: values.latitude,
            longitude: values.longitude,
            maxGeoMetres: values.radius,
            label: values.label,
        };

        const { success } = await apiService.request(endpoints.updateRelationCoordinate)
            .send<ApiResponse>({ ...payload });

        return success || false;
    }

    async function remove(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deleteRelationCoordinate)
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
