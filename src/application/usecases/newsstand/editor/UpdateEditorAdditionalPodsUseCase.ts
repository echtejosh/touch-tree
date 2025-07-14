import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import EditorAdditionalPodsService from 'application/services/api/newsstand/editor/EditorAdditionalPodsService';

export default function UpdateEditorAdditionalPodsUseCase(): UseCaseContract<EditorPodModel[] | null, Promise<boolean>> {
    const editorAdditionalPodsService = Container.resolve(EditorAdditionalPodsService);

    async function handle(values: EditorPodModel[] | null): Promise<boolean> {
        return editorAdditionalPodsService.updateAdditionalPods(values);
    }

    return {
        handle,
    };
}
