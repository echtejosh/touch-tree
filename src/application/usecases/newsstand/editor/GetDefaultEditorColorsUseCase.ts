import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorColorsModel } from 'domain/models/newsstand/NewsstandModel';
import EditorColorsService from 'application/services/api/newsstand/editor/EditorColorsService';

export default function GetDefaultEditorColorsUseCase(): UseCaseContract<undefined, Promise<EditorColorsModel>> {
    const editorColorsService = Container.resolve(EditorColorsService);

    async function handle(): Promise<EditorColorsModel> {
        return editorColorsService.getDefaultColors();
    }

    return {
        handle,
    };
}
