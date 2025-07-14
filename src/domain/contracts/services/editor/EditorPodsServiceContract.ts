import {
    EditorPodModel, EditorPodsSettingsModel,
} from 'domain/models/newsstand/NewsstandModel';

/**
 * Contract for the EditorService.
 */
export interface EditorPodsServiceContract {
    getPodsSettings(): Promise<EditorPodsSettingsModel | null>

    updatePodsSettings(settings: Partial<EditorPodsSettingsModel>): Promise<boolean>

    /**
     * Fetches the pods data from the API.
     *
     * @returns A promise that resolves to the colors data or `null` if not found.
     */
    getPods(): Promise<EditorPodModel[] | null>

    createPods(): EditorPodModel[]

    updatePods(values: EditorPodModel[] | null): Promise<boolean>

    updatePod(pod: EditorPodModel | null): Promise<boolean>
}
