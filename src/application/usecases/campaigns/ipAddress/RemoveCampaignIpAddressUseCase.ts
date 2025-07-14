import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import CampaignIpAddressService from 'application/services/api/campaigns/CampaignIpAddressService';

export default function RemoveCampaignIpAddressUseCase(): UseCaseContract<number, Promise<boolean>> {
    const campaignIpAddressService = Container.resolve(CampaignIpAddressService);

    async function handle(id: number): Promise<boolean> {
        return campaignIpAddressService.removeIpAddress(id);
    }

    return {
        handle,
    };
}
