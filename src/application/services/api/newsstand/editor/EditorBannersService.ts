import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import endpoints from 'infrastructure/routes/endpoints';
import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import { Pod, retrieveLinkageType, UpdatePodPayload } from 'application/services/api/newsstand/editor/EditorPodsService';
import { EditorBannersServiceContract } from 'domain/contracts/services/editor/EditorBannersServiceContract';

interface GetDigiCustomizationsBannersResponse {
    customData: {
        banners: Pod[] | null;
    };
}

interface UpdateBannersPayload {
    objCustomisation: {
        banners: UpdatePodPayload[] | null;
    };
}

const emptyBanner: EditorPodModel = {
    imgSrc: null,
    linkage: {
        type: 'none',
        url: null,
        articleId: null,
        documentId: null,
        page: null,
    },
};

export default function EditorBannersService(): EditorBannersServiceContract {
    const apiService = Container.resolve(ApiService);

    function createBanners(): EditorPodModel[] {
        return Array(4).fill({ ...emptyBanner });
    }

    async function getBanners(): Promise<EditorPodModel[] | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsBannersResponse }>();

        const { customData } = digiPlatformCustomisation;

        if (!customData.banners) {
            return createBanners();
        }

        const mappedBanners: EditorPodModel[] = customData.banners.map((banner, index) => {
            return {
                imgSrc: banner.imgSrc ? { name: `banner-${index + 1}.jpeg`, content: banner.imgSrc } : null,
                linkage: {
                    ...banner.linkage,
                    type: retrieveLinkageType(banner.linkage),
                },
            };
        });

        const requiredBanners = 4;

        while (mappedBanners.length < requiredBanners) {
            mappedBanners.push({ ...emptyBanner });
        }

        return mappedBanners;
    }

    async function updateBanners(banners: EditorPodModel[] | null): Promise<boolean> {
        const payload: UpdateBannersPayload = {
            objCustomisation: {
                banners: banners?.map((banner) => ({
                    linkage: banner.linkage.type === 'none' ? null : banner.linkage,
                    imgSrc: banner.imgSrc?.content || null,
                })) || null,
            },
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustomPut)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    return {
        getBanners,
        updateBanners,
    };
}
