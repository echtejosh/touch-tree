import {
    EditorWebsiteModel,
} from 'domain/models/newsstand/NewsstandModel';

/**
 * Contract for the EditorService.
 */
export interface EditorWebsiteServiceContract {
    /**
     * Fetches the favicon data from the API.
     *
     * @returns A promise that resolves to the colors data or `null` if not found.
     */

    getFavicon(): Promise<EditorWebsiteModel | null>

    updateFavicon(values: Partial<EditorWebsiteModel>): Promise<boolean>
}
