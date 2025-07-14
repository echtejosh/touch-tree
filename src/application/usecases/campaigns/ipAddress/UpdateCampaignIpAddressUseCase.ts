import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';
import CampaignIpAddressService from 'application/services/api/campaigns/CampaignIpAddressService';
import { ApiResponse } from 'infrastructure/services/types';

export default function UpdateCampaignIpAddressUseCase(): UseCaseContract<Partial<CampaignIpAddressModel>, Promise<ApiResponse>> {
    const campaignIpAddressService = Container.resolve(CampaignIpAddressService);

    async function handle(values: CampaignIpAddressModel): Promise<ApiResponse> {
        return campaignIpAddressService.updateIpAddress(values);
    }

    return {
        handle,
    };
}
