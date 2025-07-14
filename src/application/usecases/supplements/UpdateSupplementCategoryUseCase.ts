import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandSupplementService from 'application/services/api/newsstand/NewsstandSupplementService';
import { SupplementCategory } from 'domain/contracts/services/SupplementServiceContract';

export default function UpdateSupplementCategoryUseCase(): UseCaseContract<SupplementCategory, Promise<boolean>> {
    const newsstandSupplementService = Container.resolve(NewsstandSupplementService);

    async function handle(values: SupplementCategory): Promise<boolean> {
        return newsstandSupplementService.updateCategory(values);
    }

    return {
        handle,
    };
}
