import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';
import { PublicationInteraction } from 'domain/models/PublicationInteraction';

export default function GetPublicationInteractionUseCase(): UseCaseContract<number, Promise<Partial<PublicationInteraction> | null>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(id: number): Promise<Partial<PublicationInteraction> | null> {
        return newsstandPublicationService.getInteraction(id);
    }

    return {
        handle,
    };
}
