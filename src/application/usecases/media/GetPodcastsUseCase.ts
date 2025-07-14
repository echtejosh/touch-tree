import PodcastsService from 'application/services/api/PodcastsService';
import Container from 'infrastructure/services/Container';
import { MediaModel } from 'domain/models/MediaModel';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';

export default function GetPodcastsUseCase(): UseCaseContract<undefined, Promise<MediaModel[] | null>> {
    const podcastsService = Container.resolve(PodcastsService);

    async function handle(): Promise<MediaModel[] | null> {
        return podcastsService.getPodcasts();
    }

    return {
        handle,
    };
}
