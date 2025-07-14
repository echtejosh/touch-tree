import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';
import { PublicationInteraction } from 'domain/models/PublicationInteraction';

export default function CreatePublicationInteractionUseCase(): UseCaseContract<PublicationInteraction, Promise<number | null>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(values: PublicationInteraction): Promise<number | null> {
        return newsstandPublicationService.createInteraction(values);
    }

    return {
        handle,
    };
}
