import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { CampaignModel } from 'domain/models/CampaignModel';
import CampaignService from 'application/services/api/campaigns/CampaignService';
import Container from 'infrastructure/services/Container';

export default function GetCampaignUseCase(): UseCaseContract<number, Promise<CampaignModel | null>> {
    const campaignService = Container.resolve(CampaignService);

    async function handle(id: number): Promise<CampaignModel | null> {
        return campaignService.getCampaign(id);
    }

    return {
        handle,
    };
}
