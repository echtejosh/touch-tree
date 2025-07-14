import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import CampaignGeoCoordinateService from 'application/services/api/campaigns/CampaignGeoCoordinateService';

export default function RemoveCampaignGeoCoordinateUseCase(): UseCaseContract<number, Promise<boolean>> {
    const campaignGeoCoordinateService = Container.resolve(CampaignGeoCoordinateService);

    async function handle(id: number): Promise<boolean> {
        return campaignGeoCoordinateService.removeGeoCoordinate(id);
    }

    return {
        handle,
    };
}
