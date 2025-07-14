import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';

import { FileShape } from 'domain/contracts/services/FileServiceContract';
import NewsstandSettingsService from 'application/services/api/newsstand/NewsstandSettingsService';

export default function UploadEmailsAccessFileUseCase(): UseCaseContract<FileShape, Promise<boolean>> {
    const newsstandSettingsService = Container.resolve(NewsstandSettingsService);

    async function handle(values: FileShape): Promise<boolean> {
        return newsstandSettingsService.uploadEmailsAccessFile(values);
    }

    return {
        handle,
    };
}
