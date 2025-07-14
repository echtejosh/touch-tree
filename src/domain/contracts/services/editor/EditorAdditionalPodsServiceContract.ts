import type {
    EditorPodModel,
} from 'domain/models/newsstand/NewsstandModel';

/**
 * Contract for the EditorService.
 */
export interface EditorAdditionalPodsServiceContract {
    /**
     * Fetches the pods data from the API.
     *
     * @returns A promise that resolves to the colors data or `null` if not found.
     */
    getAdditionalPods(): Promise<EditorPodModel[] | null>

    createAdditionalPods(): EditorPodModel[]

    updateAdditionalPods(values: EditorPodModel[] | null): Promise<boolean>

    updateAdditionalPod(pod: EditorPodModel): Promise<boolean>
}
