import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';

import { FileShape } from 'domain/contracts/services/FileServiceContract';
import NewsstandSettingsService from 'application/services/api/newsstand/NewsstandSettingsService';

export default function GetRegistrantsFileUseCase(): UseCaseContract<undefined, Promise<FileShape | null>> {
    const newsstandSettingsService = Container.resolve(NewsstandSettingsService);

    async function handle(): Promise<FileShape | null> {
        return newsstandSettingsService.getRegistrantsFile();
    }

    return {
        handle,
    };
}
