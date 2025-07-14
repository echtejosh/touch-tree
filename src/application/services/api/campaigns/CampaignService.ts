import Container from 'infrastructure/services/Container';
import { CampaignModel } from 'domain/models/CampaignModel';
import CampaignRepository from 'infrastructure/repositories/CampaignRepository';
import endpoints from 'infrastructure/routes/endpoints';
import { ApiService } from 'infrastructure/services';
import { ApiResponse } from 'infrastructure/services/types';

export default function CampaignService() {
    const apiService = Container.resolve(ApiService);
    const campaignRepository = Container.resolve(CampaignRepository);

    async function getCampaigns(): Promise<CampaignModel[] | null> {
        return campaignRepository.getAll();
    }

    async function getCampaign(id: number): Promise<CampaignModel | null> {
        return campaignRepository.getById(id);
    }

    async function updateCampaign(values: CampaignModel): Promise<ApiResponse> {
        return campaignRepository.update(values);
    }

    async function removeCampaign(id: number): Promise<boolean> {
        return campaignRepository.remove(id);
    }

    async function createCampaign(values: CampaignModel): Promise<null | number | ApiResponse> {
        return campaignRepository.create(values);
    }

    async function duplicateCampaign(id: number): Promise<boolean> {
        const { success } = await apiService.request(endpoints.duplicateCampaign)
            .send<{ success: boolean }>({ id });

        return success || false;
    }

    return {
        getCampaigns,
        getCampaign,
        updateCampaign,
        removeCampaign,
        createCampaign,
        duplicateCampaign,
    };
}
