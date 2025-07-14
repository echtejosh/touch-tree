import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { NewsstandPublicationModel } from 'domain/models/newsstand/NewsstandPublicationModel';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';

export default function GetPublicationsUseCase(): UseCaseContract<undefined, Promise<NewsstandPublicationModel[] | null>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(): Promise<NewsstandPublicationModel[] | null> {
        return newsstandPublicationService.getPublications();
    }

    return {
        handle,
    };
}
