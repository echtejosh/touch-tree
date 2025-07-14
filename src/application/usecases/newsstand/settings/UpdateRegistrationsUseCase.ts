import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { RegistrationsModel } from 'domain/models/newsstand/NewsstandSettingsModel';
import NewsstandSettingsService from 'application/services/api/newsstand/NewsstandSettingsService';

export default function UpdateRegistrationsUseCase(): UseCaseContract<Partial<RegistrationsModel>, Promise<boolean>> {
    const newsstandSettingsService = Container.resolve(NewsstandSettingsService);

    async function handle(values: Partial<RegistrationsModel>): Promise<boolean> {
        return newsstandSettingsService.updateRegistrations(values);
    }

    return {
        handle,
    };
}
