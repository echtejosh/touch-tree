import {
    EditorLogoModel,
} from 'domain/models/newsstand/NewsstandModel';

/**
 * Contract for the EditorService.
 */
export interface EditorLogoServiceContract {
    /**
     * Fetches the logo data from the API.
     *
     * @returns A promise that resolves to the colors data or `null` if not found.
     */
    getLogo(): Promise<EditorLogoModel | null>;

    updateLogo(values: Partial<EditorLogoModel>): Promise<boolean>;
}
