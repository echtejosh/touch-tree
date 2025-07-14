import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import EditorPodsService from 'application/services/api/newsstand/editor/EditorPodsService';

export default function GetEditorPodsUseCase(): UseCaseContract<undefined, Promise<EditorPodModel[] | null>> {
    const editorPodsService = Container.resolve(EditorPodsService);

    async function handle(): Promise<EditorPodModel[] | null> {
        return editorPodsService.getPods();
    }

    return {
        handle,
    };
}
