import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import EditorAdditionalPodsService from 'application/services/api/newsstand/editor/EditorAdditionalPodsService';

export default function GetEditorAdditionalPodsUseCase(): UseCaseContract<undefined, Promise<EditorPodModel[] | null>> {
    const editorAdditionalPodsService = Container.resolve(EditorAdditionalPodsService);

    async function handle(): Promise<EditorPodModel[] | null> {
        return editorAdditionalPodsService.getAdditionalPods();
    }

    return {
        handle,
    };
}
