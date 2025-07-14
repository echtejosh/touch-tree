import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandSupplementService from 'application/services/api/newsstand/NewsstandSupplementService';
import { CreateDocumentModel } from 'domain/models/newsstand/NewsstandSupplementModel';

export default function CreateSupplementDocumentUseCase(): UseCaseContract<CreateDocumentModel, Promise<boolean>> {
    const newsstandSupplementService = Container.resolve(NewsstandSupplementService);

    async function handle(document: CreateDocumentModel): Promise<boolean> {
        return newsstandSupplementService.createDocument(document);
    }

    return {
        handle,
    };
}
