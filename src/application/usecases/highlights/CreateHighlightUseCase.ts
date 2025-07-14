import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import HighlightService from 'application/services/api/HighlightService';
import { HighlightModel } from 'domain/models/HighlightModel';

export default function CreateHighlightUseCase(): UseCaseContract<HighlightModel, Promise<boolean>> {
    const highlightService = Container.resolve(HighlightService);

    async function handle(values: HighlightModel): Promise<boolean> {
        return highlightService.addHighlight(values);
    }

    return {
        handle,
    };
}
