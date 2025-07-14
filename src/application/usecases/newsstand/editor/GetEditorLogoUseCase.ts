import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorLogoModel } from 'domain/models/newsstand/NewsstandModel';
import EditorLogoService from 'application/services/api/newsstand/editor/EditorLogoService';

export default function GetEditorLogoUseCase(): UseCaseContract<undefined, Promise<EditorLogoModel | null>> {
    const editorLogoService = Container.resolve(EditorLogoService);

    async function handle(): Promise<EditorLogoModel | null> {
        return editorLogoService.getLogo();
    }

    return {
        handle,
    };
}
