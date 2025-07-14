import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EmailAccessFileModel } from 'domain/models/newsstand/NewsstandSettingsModel';
import NewsstandSettingsService from 'application/services/api/newsstand/NewsstandSettingsService';

export default function GetEmailAccessFilesUseCase(): UseCaseContract<undefined, Promise<EmailAccessFileModel[] | null>> {
    const newsstandSettingsService = Container.resolve(NewsstandSettingsService);

    async function handle(): Promise<EmailAccessFileModel[] | null> {
        return newsstandSettingsService.getEmailAccessFiles();
    }

    return {
        handle,
    };
}
