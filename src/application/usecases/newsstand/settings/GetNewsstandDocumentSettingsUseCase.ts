import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { DocumentSettingsModel } from 'domain/models/newsstand/NewsstandSettingsModel';
import NewsstandSettingsService from 'application/services/api/newsstand/NewsstandSettingsService';

export default function GetNewsstandDocumentSettingsUseCase(): UseCaseContract<undefined, Promise<Partial<DocumentSettingsModel> | null>> {
    const newsstandSettingsService = Container.resolve(NewsstandSettingsService);

    async function handle(): Promise<Partial<DocumentSettingsModel> | null> {
        return newsstandSettingsService.getDocumentSettings();
    }

    return {
        handle,
    };
}
