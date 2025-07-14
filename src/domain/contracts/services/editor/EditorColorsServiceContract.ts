import {
    EditorColorsModel,
} from 'domain/models/newsstand/NewsstandModel';

/**
 * Contract for the EditorService.
 */
export interface EditorColorsServiceContract {
    /**
     * Fetches the colors data from the API.
     *
     * @returns A promise that resolves to the colors data or `null` if not found.
     */
    getColors(): Promise<EditorColorsModel | null>;

    getDefaultColors(): Promise<EditorColorsModel>;

    updateColors(values: Partial<EditorColorsModel>): Promise<boolean>;
}
