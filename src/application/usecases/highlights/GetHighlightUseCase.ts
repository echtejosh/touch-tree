import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import HighlightService from 'application/services/api/HighlightService';
import { HighlightModel } from 'domain/models/HighlightModel';

export default function GetHighlightUseCase(): UseCaseContract<number, Promise<HighlightModel | null>> {
    const highlightService = Container.resolve(HighlightService);

    async function handle(id: number): Promise<HighlightModel | null> {
        return highlightService.getHighlight(id);
    }

    return {
        handle,
    };
}
