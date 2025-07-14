import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { HighlightModel } from 'domain/models/HighlightModel';
import HighlightService from 'application/services/api/HighlightService';

export default function GetHighlightsUseCase(): UseCaseContract<undefined, Promise<HighlightModel[] | null>> {
    const highlightService = Container.resolve(HighlightService);

    async function handle(): Promise<HighlightModel[] | null> {
        return highlightService.getHighlights();
    }

    return {
        handle,
    };
}
