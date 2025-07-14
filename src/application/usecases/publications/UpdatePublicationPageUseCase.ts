import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';
import { NewsstandPublicationPageModel } from 'domain/models/newsstand/NewsstandPublicationModel';

export default function UpdatePublicationPageUseCase(): UseCaseContract<Partial<NewsstandPublicationPageModel>, Promise<boolean>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(values: Partial<NewsstandPublicationPageModel>): Promise<boolean> {
        return newsstandPublicationService.updatePublicationPage(values);
    }

    return {
        handle,
    };
}
