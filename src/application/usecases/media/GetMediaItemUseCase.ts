import Container from 'infrastructure/services/Container';
import MediaService from 'application/services/api/MediaService';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { MediaModel } from 'domain/models/MediaModel';

export default function GetMediaItemUseCase(): UseCaseContract<number, Promise<Partial<MediaModel> | null>> {
    const mediaService = Container.resolve(MediaService);

    async function handle(articleId: number): Promise<Partial<MediaModel> | null> {
        return mediaService.getMediaItem(articleId);
    }

    return {
        handle,
    };
}
