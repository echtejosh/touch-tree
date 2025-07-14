import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorLogoModel } from 'domain/models/newsstand/NewsstandModel';
import EditorLogoService from 'application/services/api/newsstand/editor/EditorLogoService';

export default function UpdateEditorLogoUseCase(): UseCaseContract<Partial<EditorLogoModel>, Promise<boolean>> {
    const editorLogoService = Container.resolve(EditorLogoService);

    async function handle(values: Partial<EditorLogoModel>): Promise<boolean> {
        return editorLogoService.updateLogo(values);
    }

    return {
        handle,
    };
}
