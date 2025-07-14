import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { EditorSidebarModel } from 'domain/models/newsstand/NewsstandModel';
import EditorSidebarService from 'application/services/api/newsstand/editor/EditorSidebarService';

export default function GetEditorSidebarUseCase(): UseCaseContract<undefined, Promise<EditorSidebarModel | null>> {
    const editorSidebarService = Container.resolve(EditorSidebarService);

    async function handle(): Promise<EditorSidebarModel | null> {
        return editorSidebarService.getSidebar();
    }

    return {
        handle,
    };
}
