import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import CampaignService from 'application/services/api/campaigns/CampaignService';
import Container from 'infrastructure/services/Container';

export default function DuplicateCampaignUseCase(): UseCaseContract<number, Promise<boolean>> {
    const campaignService = Container.resolve(CampaignService);

    async function handle(id: number): Promise<boolean> {
        return campaignService.duplicateCampaign(id);
    }

    return {
        handle,
    };
}
