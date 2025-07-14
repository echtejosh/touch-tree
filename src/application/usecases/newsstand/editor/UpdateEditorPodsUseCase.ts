import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import EditorPodsService from 'application/services/api/newsstand/editor/EditorPodsService';

export default function UpdateEditorPodsUseCase(): UseCaseContract<EditorPodModel[] | null, Promise<boolean>> {
    const editorPodsService = Container.resolve(EditorPodsService);

    async function handle(values: EditorPodModel[] | null): Promise<boolean> {
        return editorPodsService.updatePods(values);
    }

    return {
        handle,
    };
}
