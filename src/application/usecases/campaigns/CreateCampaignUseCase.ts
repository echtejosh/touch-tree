import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { CampaignModel } from 'domain/models/CampaignModel';
import CampaignService from 'application/services/api/campaigns/CampaignService';
import Container from 'infrastructure/services/Container';
import { ApiResponse } from 'infrastructure/services/types';

export default function CreateCampaignUseCase(): UseCaseContract<CampaignModel, Promise<null | number | ApiResponse>> {
    const campaignService = Container.resolve(CampaignService);

    async function handle(values: CampaignModel): Promise<null | number | ApiResponse> {
        return campaignService.createCampaign(values);
    }

    return {
        handle,
    };
}
