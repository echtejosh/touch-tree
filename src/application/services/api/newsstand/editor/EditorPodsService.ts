import endpoints from 'infrastructure/routes/endpoints';
import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import { EditorPodsServiceContract } from 'domain/contracts/services/editor/EditorPodsServiceContract';
import {
    EditorPodModel,
    EditorPodsSettingsModel,
    LinkageModel,
    LinkageType,
} from 'domain/models/newsstand/NewsstandModel';

export interface Pod {
    imgSrc: string; /* Base64-encoded image source */
    linkage: {
        url: string | null;
        articleId: number | null;
        documentId: number | null;
        page: number | null;
    };
}

interface GetDigiCustomizationsResponse {
    customData: {
        hasRoundedEdges: boolean;
        pods: Pod[] | null;
        rectangles: Pod[] | null;
    };
}

interface UpdatePodsSettingsPayload {
    // objCustomisation: Partial<{
    //     hasRoundedEdges: boolean;
    // }>;
    hasRoundedEdges?: boolean;
}

export interface UpdatePodPayload {
    imgSrc: string | null; /* Base64-encoded image source */
    linkage: Partial<{
        type: LinkageType | null,
        url: string | null;
        articleId: number | null;
        documentId: number | null;
        page: number | null;
    }> | null;
}

interface UpdatePodsPayload {
    objCustomisation: {
        pods: UpdatePodPayload[] | null;
    };
}

interface UpdateOnePodPayload {
    id?: number;
    objCustomisation: UpdatePodPayload
}

export const retrieveLinkageType = (linkage: Omit<LinkageModel, 'type'>) => {
    if (linkage?.url) return 'url';
    if (linkage?.articleId) return 'article';
    if (linkage?.documentId) return 'document';
    return 'none';
};

export default function EditorPodsService(): EditorPodsServiceContract {
    const apiService = Container.resolve(ApiService);

    async function getPodsSettings(): Promise<EditorPodsSettingsModel | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsResponse }>();

        const { customData } = digiPlatformCustomisation;

        if (!customData) {
            return null;
        }

        return { hasRoundedEdges: customData.hasRoundedEdges };
    }

    async function updatePodsSettings(settings: Partial<EditorPodsSettingsModel>): Promise<boolean> {
        const payload: UpdatePodsSettingsPayload = {
            ...settings,
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustom)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    async function getPods(): Promise<EditorPodModel[] | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsResponse }>();

        const { customData } = digiPlatformCustomisation;

        if (!customData.pods) {
            return null;
        }

        return customData.pods?.map((pod, index) => {
            return {
                imgSrc: pod.imgSrc ? {
                    name: `square-${index + 1}.jpeg`,
                    content: pod.imgSrc,
                } : null,
                linkage: {
                    ...pod.linkage,
                    type: retrieveLinkageType(pod.linkage),
                },
            };
        }) || [];
    }

    function createPods(): EditorPodModel[] {
        return Array(4)
            .fill(null)
            .map(() => ({
                imgSrc: null,
                linkage: {
                    type: 'none',
                    url: null,
                    articleId: null,
                    documentId: null,
                    page: null,
                },
            }));
    }
    // Prev implementation
    // async function createPods(): Promise<boolean> {
    //     const { success } = await apiService.request(endpoints.createNewsstandCustomInit)
    //         .send<{ success: boolean }>({ property: 'pods' });
    //
    //     return success || false;
    // }

    async function updatePods(pods: EditorPodModel[] | null): Promise<boolean> {
        const payload: UpdatePodsPayload = {
            objCustomisation: {
                pods: pods?.map((pod) => ({
                    linkage: pod.linkage.type === 'none' ? null : pod.linkage,
                    imgSrc: pod.imgSrc?.content || null,
                })) || null,
            },
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustomPut)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    async function updatePod(pod: EditorPodModel): Promise<boolean> {
        const payload: UpdateOnePodPayload = {
            objCustomisation: {
                linkage: pod.linkage.type === 'none' ? null : pod.linkage,
                imgSrc: pod.imgSrc?.content || null,
            },
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustomId)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    return {
        getPodsSettings,
        updatePodsSettings,
        getPods,
        createPods,
        updatePods,
        updatePod,
    };
}
