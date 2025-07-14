import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import EditorAdditionalPodsService from 'application/services/api/newsstand/editor/EditorAdditionalPodsService';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';

export default function CreateEditorAdditionalPodsUseCase(): UseCaseContract<undefined, EditorPodModel[]> {
    const editorPodsService = Container.resolve(EditorAdditionalPodsService);

    function handle(): EditorPodModel[] {
        return editorPodsService.createAdditionalPods();
    }

    return {
        handle,
    };
}
