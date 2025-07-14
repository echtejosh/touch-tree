import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import CampaignGeoCoordinateService from 'application/services/api/campaigns/CampaignGeoCoordinateService';
import { CampaignGeoCoordinateModel } from 'domain/models/CampaignGeoCoordinateModel';

export default function UpdateCampaignGeoCoordinateUseCase(): UseCaseContract<Partial<CampaignGeoCoordinateModel>, Promise<boolean>> {
    const campaignGeoCoordinateService = Container.resolve(CampaignGeoCoordinateService);

    async function handle(values: CampaignGeoCoordinateModel): Promise<boolean> {
        return campaignGeoCoordinateService.updateGeoCoordinate(values);
    }

    return {
        handle,
    };
}
