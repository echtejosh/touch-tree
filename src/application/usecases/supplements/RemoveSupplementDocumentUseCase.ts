import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandSupplementService from 'application/services/api/newsstand/NewsstandSupplementService';
import { ApiResponse } from 'infrastructure/services/types';

export default function RemoveSupplementDocumentUseCase(): UseCaseContract<number, Promise<ApiResponse>> {
    const newsstandSupplementService = Container.resolve(NewsstandSupplementService);

    async function handle(id: number): Promise<ApiResponse> {
        return newsstandSupplementService.removeDocument(id);
    }

    return {
        handle,
    };
}
