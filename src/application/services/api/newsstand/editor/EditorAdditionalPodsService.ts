import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import endpoints from 'infrastructure/routes/endpoints';
import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import { EditorAdditionalPodsServiceContract } from 'domain/contracts/services/editor/EditorAdditionalPodsServiceContract';
import { Pod, retrieveLinkageType, UpdatePodPayload } from 'application/services/api/newsstand/editor/EditorPodsService';

interface GetDigiCustomizationsPodsResponse {
    customData: {
        rectangles: Pod[] | null;
    };
}

interface UpdateAdditionalPodsPayload {
    objCustomisation: {
        rectangles: UpdatePodPayload[] | null;
    };
}

interface UpdateOnePodPayload {
    id?: number;
    objCustomisation: UpdatePodPayload
}

export default function EditorAdditionalPodsService(): EditorAdditionalPodsServiceContract {
    const apiService = Container.resolve(ApiService);

    async function getAdditionalPods(): Promise<EditorPodModel[] | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsPodsResponse }>();

        const { customData } = digiPlatformCustomisation;

        if (!customData.rectangles) {
            return null;
        }

        return customData.rectangles?.map((pod, index) => {
            return {
                imgSrc: pod.imgSrc ? { name: `rectangle-${index + 1}.jpeg`, content: pod.imgSrc } : null,
                linkage: {
                    ...pod.linkage,
                    type: retrieveLinkageType(pod.linkage),
                },
            };
        }) || [];
    }

    function createAdditionalPods(): EditorPodModel[] {
        return Array(2)
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
    // async function createAdditionalPods(): Promise<boolean> {
    //     const { success } = await apiService.request(endpoints.createNewsstandCustomInit)
    //         .send<{ success: boolean }>({ property: 'rectangles' });
    //
    //     return success || false;
    // }

    async function updateAdditionalPods(pods: EditorPodModel[] | null): Promise<boolean> {
        const payload: UpdateAdditionalPodsPayload = {
            objCustomisation: {
                rectangles: pods?.map((pod) => ({
                    linkage: pod.linkage.type === 'none' ? null : pod.linkage,
                    imgSrc: pod.imgSrc?.content || null,
                })) || null,
            },
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustomPut)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    async function updateAdditionalPod(pod: EditorPodModel): Promise<boolean> {
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
        getAdditionalPods,
        createAdditionalPods,
        updateAdditionalPods,
        updateAdditionalPod,
    };
}
