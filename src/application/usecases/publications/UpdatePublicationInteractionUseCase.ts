import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';
import { PublicationInteraction } from 'domain/models/PublicationInteraction';

export default function UpdatePublicationInteractionUseCase(): UseCaseContract<Partial<PublicationInteraction>, Promise<boolean>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(values: Partial<PublicationInteraction>): Promise<boolean> {
        return newsstandPublicationService.updateInteraction(values);
    }

    return {
        handle,
    };
}
