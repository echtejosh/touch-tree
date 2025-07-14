import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import CampaignGeoCoordinateService from 'application/services/api/campaigns/CampaignGeoCoordinateService';
import { CampaignGeoCoordinateModel } from 'domain/models/CampaignGeoCoordinateModel';

export default function GetCampaignGeoCoordinateUseCase(): UseCaseContract<[number, number], Promise<CampaignGeoCoordinateModel | null>> {
    const campaignGeoCoordinatesService = Container.resolve(CampaignGeoCoordinateService);

    async function handle([campaignId, id]: [number, number]): Promise<CampaignGeoCoordinateModel | null> {
        return campaignGeoCoordinatesService.getGeoCoordinate(campaignId, id);
    }
    return {
        handle,
    };
}
