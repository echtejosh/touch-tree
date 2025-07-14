import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import EditorAdditionalPodsService from 'application/services/api/newsstand/editor/EditorAdditionalPodsService';

export default function UpdateEditorAdditionalPodUseCase(): UseCaseContract<EditorPodModel[] | null, Promise<boolean>> {
    const editorPodsService = Container.resolve(EditorAdditionalPodsService);

    async function handle(values: EditorPodModel[]): Promise<boolean> {
        return editorPodsService.updateAdditionalPods(values);
    }

    return {
        handle,
    };
}
