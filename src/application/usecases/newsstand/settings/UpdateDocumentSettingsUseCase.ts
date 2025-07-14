import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { DocumentSettingsModel } from 'domain/models/newsstand/NewsstandSettingsModel';
import NewsstandSettingsService from 'application/services/api/newsstand/NewsstandSettingsService';

export default function UpdateDocumentSettingsUseCase(): UseCaseContract<Partial<DocumentSettingsModel>, Promise<boolean>> {
    const newsstandSettingsService = Container.resolve(NewsstandSettingsService);

    async function handle(values: Partial<DocumentSettingsModel>): Promise<boolean> {
        return newsstandSettingsService.updateDocumentSettings(values);
    }

    return {
        handle,
    };
}
