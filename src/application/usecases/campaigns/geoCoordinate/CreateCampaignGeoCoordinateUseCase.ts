import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { CampaignGeoCoordinateModel } from 'domain/models/CampaignGeoCoordinateModel';
import CampaignGeoCoordinateService from 'application/services/api/campaigns/CampaignGeoCoordinateService';

export default function CreateCampaignGeoCoordinateUseCase(): UseCaseContract<CampaignGeoCoordinateModel, Promise<boolean>> {
    const campaignGeoCoordinateService = Container.resolve(CampaignGeoCoordinateService);

    async function handle(values: CampaignGeoCoordinateModel): Promise<boolean> {
        return campaignGeoCoordinateService.createGeoCoordinate(values);
    }

    return {
        handle,
    };
}
