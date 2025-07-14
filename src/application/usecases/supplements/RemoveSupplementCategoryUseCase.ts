import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandSupplementService from 'application/services/api/newsstand/NewsstandSupplementService';

export default function RemoveSupplementCategoryUseCase(): UseCaseContract<number, Promise<boolean>> {
    const newsstandSupplementService = Container.resolve(NewsstandSupplementService);

    async function handle(id: number): Promise<boolean> {
        return newsstandSupplementService.removeCategory(id);
    }

    return {
        handle,
    };
}
