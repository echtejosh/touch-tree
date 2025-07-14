import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorWebsiteModel } from 'domain/models/newsstand/NewsstandModel';
import EditorWebsiteService from 'application/services/api/newsstand/editor/EditorWebsiteService';

export default function UpdateEditorFaviconUseCase(): UseCaseContract<Partial<EditorWebsiteModel>, Promise<boolean>> {
    const editorWebsiteService = Container.resolve(EditorWebsiteService);

    async function handle(values: Partial<EditorWebsiteModel>): Promise<boolean> {
        return editorWebsiteService.updateFavicon(values);
    }

    return {
        handle,
    };
}
