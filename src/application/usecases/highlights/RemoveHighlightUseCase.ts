import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import HighlightService from 'application/services/api/HighlightService';

export default function RemoveHighlightUseCase(): UseCaseContract<number, Promise<boolean>> {
    const highlightService = Container.resolve(HighlightService);

    async function handle(id: number): Promise<boolean> {
        return highlightService.removeHighlight(id);
    }

    return {
        handle,
    };
}
