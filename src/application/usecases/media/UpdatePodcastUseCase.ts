import Container from 'infrastructure/services/Container';
import { MediaModel } from 'domain/models/MediaModel';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import PodcastsService from 'application/services/api/PodcastsService';

export default function UpdatePodcastUseCase(): UseCaseContract<Partial<MediaModel>, Promise<boolean>> {
    const podcastsService = Container.resolve(PodcastsService);

    async function handle(values: Partial<MediaModel>): Promise<boolean> {
        return podcastsService.updatePodcast(values);
    }

    return {
        handle,
    };
}
