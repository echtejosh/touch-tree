import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';
import { ArticleModel } from 'domain/models/newsstand/NewsstandPublicationModel';

export default function GetArticleUseCase(): UseCaseContract<number, Promise<Partial<ArticleModel> | null>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(id: number): Promise<Partial<ArticleModel> | null> {
        return newsstandPublicationService.getArticle(id);
    }

    return {
        handle,
    };
}
