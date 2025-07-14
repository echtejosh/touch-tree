import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandSupplementService from 'application/services/api/newsstand/NewsstandSupplementService';
import { SupplementsModel } from 'domain/models/newsstand/NewsstandSupplementModel';

export default function GetSupplementsUseCase(): UseCaseContract<undefined, Promise<SupplementsModel | null>> {
    const newsstandSupplementService = Container.resolve(NewsstandSupplementService);

    async function handle(): Promise<SupplementsModel | null> {
        return newsstandSupplementService.getSupplements();
    }

    return {
        handle,
    };
}
