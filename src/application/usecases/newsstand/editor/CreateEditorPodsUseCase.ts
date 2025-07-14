import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import EditorPodsService from 'application/services/api/newsstand/editor/EditorPodsService';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';

export default function CreateEditorPodsUseCase(): UseCaseContract<undefined, EditorPodModel[]> {
    const editorPodsService = Container.resolve(EditorPodsService);

    function handle(): EditorPodModel[] {
        return editorPodsService.createPods();
    }

    return {
        handle,
    };
}
