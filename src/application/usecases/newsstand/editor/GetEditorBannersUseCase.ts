import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import EditorBannersService from 'application/services/api/newsstand/editor/EditorBannersService';

export default function GetEditorBannersUseCase(): UseCaseContract<undefined, Promise<EditorPodModel[] | null>> {
    const editorBannersService = Container.resolve(EditorBannersService);

    async function handle(): Promise<EditorPodModel[] | null> {
        return editorBannersService.getBanners();
    }

    return {
        handle,
    };
}
