import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import HighlightService from 'application/services/api/HighlightService';
import { HighlightModel } from 'domain/models/HighlightModel';

export default function UpdateHighlightUseCase(): UseCaseContract<Partial<HighlightModel>, Promise<boolean>> {
    const highlightService = Container.resolve(HighlightService);

    async function handle(values: HighlightModel): Promise<boolean> {
        return highlightService.updateHighlight(values);
    }

    return {
        handle,
    };
}
