import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandSupplementService from 'application/services/api/newsstand/NewsstandSupplementService';

export default function CreateSupplementCategoryUseCase(): UseCaseContract<string, Promise<boolean>> {
    const newsstandSupplementService = Container.resolve(NewsstandSupplementService);

    async function handle(label: string): Promise<boolean> {
        return newsstandSupplementService.createCategory(label);
    }

    return {
        handle,
    };
}
