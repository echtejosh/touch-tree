import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { NewsstandPublicationPageModel, PublicationPageReferenceModel } from 'domain/models/newsstand/NewsstandPublicationModel';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';

export default function GetPublicationPageUseCase(): UseCaseContract<PublicationPageReferenceModel, Promise<NewsstandPublicationPageModel | null>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(values: PublicationPageReferenceModel): Promise<NewsstandPublicationPageModel | null> {
        return newsstandPublicationService.getPublicationPage(values);
    }

    return {
        handle,
    };
}
