import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodsSettingsModel } from 'domain/models/newsstand/NewsstandModel';
import EditorPodsService from 'application/services/api/newsstand/editor/EditorPodsService';

export default function UpdateEditorPodsSettingsUseCase(): UseCaseContract<Partial<EditorPodsSettingsModel>, Promise<boolean>> {
    const editorPodsService = Container.resolve(EditorPodsService);

    async function handle(values: Partial<EditorPodsSettingsModel>): Promise<boolean> {
        return editorPodsService.updatePodsSettings(values);
    }

    return {
        handle,
    };
}
