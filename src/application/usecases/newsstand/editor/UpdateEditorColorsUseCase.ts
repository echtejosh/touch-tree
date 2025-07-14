import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import EditorColorsService from 'application/services/api/newsstand/editor/EditorColorsService';
import { EditorColorsModel } from 'domain/models/newsstand/NewsstandModel';

export default function UpdateEditorColorsUseCase(): UseCaseContract<Partial<EditorColorsModel>, Promise<boolean>> {
    const editorColorsService = Container.resolve(EditorColorsService);

    async function handle(values: Partial<EditorColorsModel>): Promise<boolean> {
        return editorColorsService.updateColors(values);
    }

    return {
        handle,
    };
}
