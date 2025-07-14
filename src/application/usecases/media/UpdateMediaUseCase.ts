import Container from 'infrastructure/services/Container';
import MediaService from 'application/services/api/MediaService';
import { MediaModel } from 'domain/models/MediaModel';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';

export default function UpdateMediaUseCase(): UseCaseContract<Partial<MediaModel>, Promise<boolean>> {
    const mediaService = Container.resolve(MediaService);

    async function handle(values: Partial<MediaModel>): Promise<boolean> {
        return mediaService.updateMedia(values);
    }

    return {
        handle,
    };
}
