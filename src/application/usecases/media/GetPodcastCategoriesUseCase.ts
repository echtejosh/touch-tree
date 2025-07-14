import PodcastsService from 'application/services/api/PodcastsService';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { CategoryModel } from 'domain/models/MediaModel';

export default function GetPodcastCategoriesUseCase(): UseCaseContract<undefined, Promise<CategoryModel[] | null>> {
    const podcastsService = PodcastsService();

    async function handle(): Promise<CategoryModel[] | null> {
        return podcastsService.getPodcastCategories();
    }

    return {
        handle,
    };
}
