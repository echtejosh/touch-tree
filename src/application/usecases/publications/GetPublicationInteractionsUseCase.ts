import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';
import { PublicationInteractions } from 'domain/models/PublicationInteraction';

interface GetPublicationInteractionsUseCaseShape {
    id: number,
    page: number
}

export default function GetPublicationInteractionsUseCase(): UseCaseContract<GetPublicationInteractionsUseCaseShape, Promise<PublicationInteractions | null>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(values: GetPublicationInteractionsUseCaseShape): Promise<PublicationInteractions | null> {
        return newsstandPublicationService.getInteractions(values.id, values.page);
    }

    return {
        handle,
    };
}
