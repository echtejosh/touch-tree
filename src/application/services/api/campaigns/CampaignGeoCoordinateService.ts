import Container from 'infrastructure/services/Container';
import CampaignGeoCoordinateRepository from 'infrastructure/repositories/CampaignGeoCoordinateRepository';
import { CampaignGeoCoordinateModel } from 'domain/models/CampaignGeoCoordinateModel';

export default function CampaignGeoCoordinateService() {
    const campaignGeoCoordinatesRepository = Container.resolve(CampaignGeoCoordinateRepository);

    async function getGeoCoordinates(id: number): Promise<CampaignGeoCoordinateModel[] | null> {
        return campaignGeoCoordinatesRepository.getAll(id);
    }

    async function getGeoCoordinate(campaignId: number, id: number): Promise<CampaignGeoCoordinateModel | null> {
        return campaignGeoCoordinatesRepository.getById(campaignId, id);
    }

    async function updateGeoCoordinate(values: CampaignGeoCoordinateModel): Promise<boolean> {
        return campaignGeoCoordinatesRepository.update(values);
    }

    async function removeGeoCoordinate(id: number): Promise<boolean> {
        return campaignGeoCoordinatesRepository.remove(id);
    }

    async function createGeoCoordinate(values: CampaignGeoCoordinateModel): Promise<boolean> {
        return campaignGeoCoordinatesRepository.create(values);
    }

    return {
        getGeoCoordinates,
        getGeoCoordinate,
        updateGeoCoordinate,
        removeGeoCoordinate,
        createGeoCoordinate,
    };
}
