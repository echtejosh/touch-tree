import Container from 'infrastructure/services/Container';
import MediaService from 'application/services/api/MediaService';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { MediaModel } from 'domain/models/MediaModel';

export default function GetMediaUseCase(): UseCaseContract<undefined, Promise<MediaModel[] | null>> {
    const mediaService = Container.resolve(MediaService);

    async function handle(): Promise<MediaModel[] | null> {
        return mediaService.getMedia();
    }

    return {
        handle,
    };
}
