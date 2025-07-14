import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorWebsiteModel } from 'domain/models/newsstand/NewsstandModel';
import EditorWebsiteService from 'application/services/api/newsstand/editor/EditorWebsiteService';

export default function GetEditorFaviconUseCase(): UseCaseContract<undefined, Promise<EditorWebsiteModel | null>> {
    const editorWebsiteService = Container.resolve(EditorWebsiteService);

    async function handle(): Promise<EditorWebsiteModel | null> {
        return editorWebsiteService.getFavicon();
    }

    return {
        handle,
    };
}
