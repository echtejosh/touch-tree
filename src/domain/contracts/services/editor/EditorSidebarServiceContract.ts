import {
    EditorSidebarModel,
} from 'domain/models/newsstand/NewsstandModel';

/**
 * Contract for the EditorService.
 */
export interface EditorSidebarServiceContract {
    /**
     * Fetches the sidebar data from the API.
     *
     * @returns A promise that resolves to the colors data or `null` if not found.
     */

    getSidebar(): Promise<EditorSidebarModel | null>;

    updateSidebar(values: Partial<EditorSidebarModel>): Promise<boolean>
}
