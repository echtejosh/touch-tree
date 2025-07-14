import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { NewsstandPublicationPagesModel } from 'domain/models/newsstand/NewsstandPublicationModel';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';

export default function GetPublicationPagesUseCase(): UseCaseContract<number, Promise<NewsstandPublicationPagesModel[] | null>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(publicationId: number): Promise<NewsstandPublicationPagesModel[] | null> {
        return newsstandPublicationService.getPublicationPages(publicationId);
    }

    return {
        handle,
    };
}
