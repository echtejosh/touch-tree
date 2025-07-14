import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';

export default function DeletePublicationInteractionUseCase(): UseCaseContract<number, Promise<boolean>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(id: number): Promise<boolean> {
        return newsstandPublicationService.deleteInteraction(id);
    }

    return {
        handle,
    };
}
