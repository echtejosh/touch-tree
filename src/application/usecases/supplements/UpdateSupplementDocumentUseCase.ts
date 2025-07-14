import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandSupplementService from 'application/services/api/newsstand/NewsstandSupplementService';
import { UpdateDocumentModel } from 'domain/models/newsstand/NewsstandSupplementModel';

export default function UpdateSupplementDocumentUseCase(): UseCaseContract<UpdateDocumentModel, Promise<boolean>> {
    const newsstandSupplementService = Container.resolve(NewsstandSupplementService);

    async function handle(document: UpdateDocumentModel): Promise<boolean> {
        return newsstandSupplementService.updateDocument(document);
    }

    return {
        handle,
    };
}
