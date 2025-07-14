import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';
import CampaignIpAddressService from 'application/services/api/campaigns/CampaignIpAddressService';

export default function GetCampaignIpAddressesUseCase(): UseCaseContract<number, Promise<CampaignIpAddressModel[] | null>> {
    const campaignIpAddressService = Container.resolve(CampaignIpAddressService);

    async function handle(id: number): Promise<CampaignIpAddressModel[] | null> {
        return campaignIpAddressService.getIpAddresses(id);
    }

    return {
        handle,
    };
}
