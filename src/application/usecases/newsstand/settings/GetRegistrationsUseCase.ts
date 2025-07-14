import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { RegistrationsModel } from 'domain/models/newsstand/NewsstandSettingsModel';
import NewsstandSettingsService from 'application/services/api/newsstand/NewsstandSettingsService';

export default function GetRegistrationsUseCase(): UseCaseContract<undefined, Promise<RegistrationsModel | null>> {
    const newsstandSettingsService = Container.resolve(NewsstandSettingsService);

    async function handle(): Promise<RegistrationsModel | null> {
        return newsstandSettingsService.getRegistrations();
    }

    return {
        handle,
    };
}
