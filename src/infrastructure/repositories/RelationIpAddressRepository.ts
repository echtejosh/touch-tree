import { ApiService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import endpoints from 'infrastructure/routes/endpoints';
import { RelationIpAddressModel } from 'domain/models/RelationIpAddressModel';
import { ApiResponse } from 'infrastructure/services/types';

interface GetRelationIpAddressResponse {
    id: number,
    ip: string,
    ipMask: number,
    label: string | null,
}

interface GetRelationIpAddressesResponse {
    relationIpAddresses: Array<GetRelationIpAddressResponse>;
}

interface CreateIpAddressPayload {
    ip: string,
    ipMask: number,
    label: string | null,
}

interface UpdateIpAddressPayload {
    id: number,
    ip: string,
    ipMask: number,
    label: string | null,
}

export default function RelationIpAddressRepository() {
    const apiService = Container.resolve(ApiService);

    async function getAll(): Promise<RelationIpAddressModel[] | null> {
        const { relationIpAddresses } = await apiService.request(endpoints.getRelationIpAddresses)
            .send<GetRelationIpAddressesResponse>();

        if (!relationIpAddresses) {
            return null;
        }
        console.log(relationIpAddresses);

        return relationIpAddresses.map((item) => {
            return {
                id: item.id,
                ip: item.ip,
                label: item.label,
                range: item.ipMask,
            };
        });
    }

    async function getById(id: number): Promise<RelationIpAddressModel | null> {
        const { relationIpAddress } = await apiService.request(endpoints.getRelationIpAddress)
            .send<{ relationIpAddress: GetRelationIpAddressResponse }>({ id });

        if (!relationIpAddress) {
            return null;
        }

        return {
            id: relationIpAddress.id,
            ip: relationIpAddress.ip,
            label: relationIpAddress.label,
            range: relationIpAddress.ipMask,
        };
    }

    async function create(values: RelationIpAddressModel): Promise<ApiResponse> {
        const payload: CreateIpAddressPayload = {
            ip: values.ip,
            ipMask: values.range,
            label: values.label,
        };

        return apiService.request(endpoints.createRelationIpAddress)
            .send<ApiResponse>({ ...payload });
    }

    async function update(values: RelationIpAddressModel): Promise<ApiResponse> {
        const payload: UpdateIpAddressPayload = {
            id: values.id,
            ip: values.ip,
            ipMask: values.range,
            label: values.label,
        };

        return apiService.request(endpoints.updateRelationIpAddress)
            .send<ApiResponse>({ ...payload });
    }

    async function remove(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deleteRelationIpAddress)
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
