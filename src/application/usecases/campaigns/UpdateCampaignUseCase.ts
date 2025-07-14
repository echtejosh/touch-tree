import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { CampaignModel } from 'domain/models/CampaignModel';
import CampaignService from 'application/services/api/campaigns/CampaignService';
import Container from 'infrastructure/services/Container';
import { ApiResponse } from 'infrastructure/services/types';

export default function UpdateCampaignUseCase(): UseCaseContract<Partial<CampaignModel>, Promise<ApiResponse>> {
    const campaignService = Container.resolve(CampaignService);

    async function handle(values: CampaignModel): Promise<ApiResponse> {
        return campaignService.updateCampaign(values);
    }

    return {
        handle,
    };
}
