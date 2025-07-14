import Container from 'infrastructure/services/Container';
import MediaService from 'application/services/api/MediaService';
import { CategoryModel } from 'domain/models/MediaModel';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';

export default function GetMediaCategoriesUseCase(): UseCaseContract<undefined, Promise<CategoryModel[] | null>> {
    const mediaService = Container.resolve(MediaService);

    async function handle(): Promise<CategoryModel[] | null> {
        return mediaService.getCategories();
    }

    return {
        handle,
    };
}
