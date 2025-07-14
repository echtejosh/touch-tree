import { ApiService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import endpoints from 'infrastructure/routes/endpoints';
import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';
import { ApiResponse } from 'infrastructure/services/types';

interface GetCampaignIpAddressResponse {
    id: number,
    ip: string,
    ipMask: number,
    label: string | null,
    campaignId: number,
}

interface GetCampaignIpAddressesResponse {
    campaignIpAddresses: Array<GetCampaignIpAddressResponse>;
}

interface CreateIpAddressPayload {
    ip: string,
    ipMask: number,
    label: string | null,
    campaignId: number,
}

interface UpdateIpAddressPayload {
    id: number,
    ip: string,
    ipMask: number,
    label: string | null,
    campaignId: number,
}

export default function CampaignIpAddressRepository() {
    const apiService = Container.resolve(ApiService);

    async function getAll(id: number): Promise<CampaignIpAddressModel[] | null> {
        const { campaignIpAddresses } = await apiService.request(endpoints.getIpAddresses)
            .send<GetCampaignIpAddressesResponse>({ campaignId: id });

        if (!campaignIpAddresses) {
            return null;
        }

        return campaignIpAddresses.map((item) => {
            return {
                id: item.id,
                ip: item.ip,
                label: item.label,
                range: item.ipMask,
                campaignId: item.campaignId,
            };
        });
    }

    async function getById(id: number): Promise<CampaignIpAddressModel | null> {
        const { campaignIpAddress: ipAddress } = await apiService.request(endpoints.getIpAddress)
            .send<{ campaignIpAddress: GetCampaignIpAddressResponse }>({ id });

        if (!ipAddress) {
            return null;
        }

        return {
            id: ipAddress.id,
            ip: ipAddress.ip,
            label: ipAddress.label,
            range: ipAddress.ipMask,
            campaignId: ipAddress.campaignId,
        };
    }

    async function create(values: CampaignIpAddressModel): Promise<ApiResponse> {
        const payload: CreateIpAddressPayload = {
            ip: values.ip,
            ipMask: values.range,
            campaignId: values.campaignId,
            label: values.label,
        };

        return apiService.request(endpoints.createIpAddress)
            .send<ApiResponse>({ ...payload });
    }

    async function update(values: CampaignIpAddressModel): Promise<ApiResponse> {
        const payload: UpdateIpAddressPayload = {
            id: values.id,
            ip: values.ip,
            ipMask: values.range,
            campaignId: values.campaignId,
            label: values.label,
        };

        return apiService.request(endpoints.updateIpAddress)
            .send<ApiResponse>({ ...payload });
    }

    async function remove(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.deleteIpAddress)
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
