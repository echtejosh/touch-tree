import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodsSettingsModel } from 'domain/models/newsstand/NewsstandModel';
import EditorPodsService from 'application/services/api/newsstand/editor/EditorPodsService';

export default function GetEditorPodsSettingsUseCase(): UseCaseContract<undefined, Promise<EditorPodsSettingsModel | null>> {
    const editorPodsService = Container.resolve(EditorPodsService);

    async function handle(): Promise<EditorPodsSettingsModel | null> {
        return editorPodsService.getPodsSettings();
    }

    return {
        handle,
    };
}
