import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import EditorBannersService from 'application/services/api/newsstand/editor/EditorBannersService';

export default function UpdateEditorBannersUseCase(): UseCaseContract<EditorPodModel[] | null, Promise<boolean>> {
    const editorBannersService = Container.resolve(EditorBannersService);

    async function handle(values: EditorPodModel[] | null): Promise<boolean> {
        return editorBannersService.updateBanners(values);
    }

    return {
        handle,
    };
}
