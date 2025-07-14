import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';
import { ArticleModel } from 'domain/models/newsstand/NewsstandPublicationModel';

export default function UpdateArticleUseCase(): UseCaseContract<Partial<ArticleModel>, Promise<boolean>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(values: Partial<ArticleModel>): Promise<boolean> {
        return newsstandPublicationService.updateArticle(values);
    }

    return {
        handle,
    };
}
