import type {
    EditorPodModel,
} from 'domain/models/newsstand/NewsstandModel';

/**
 * Contract for the EditorService.
 */
export interface EditorBannersServiceContract {
    /**
     * Fetches the banners data from the API.
     *
     * @returns A promise that resolves to the banners data or `null` if not found.
     */
    getBanners(): Promise<EditorPodModel[] | null>

    updateBanners(banners: EditorPodModel[] | null): Promise<boolean>
}
