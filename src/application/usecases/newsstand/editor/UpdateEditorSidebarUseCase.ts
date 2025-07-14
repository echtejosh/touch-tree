import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorSidebarModel } from 'domain/models/newsstand/NewsstandModel';
import EditorSidebarService from 'application/services/api/newsstand/editor/EditorSidebarService';

export default function UpdateEditorSidebarUseCase(): UseCaseContract<Partial<EditorSidebarModel>, Promise<boolean>> {
    const editorSidebarService = Container.resolve(EditorSidebarService);

    async function handle(values: Partial<EditorSidebarModel>): Promise<boolean> {
        return editorSidebarService.updateSidebar(values);
    }

    return {
        handle,
    };
}
