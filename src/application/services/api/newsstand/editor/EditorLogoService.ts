import { EditorLogoModel } from 'domain/models/newsstand/NewsstandModel';
import endpoints from 'infrastructure/routes/endpoints';
import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import { EditorLogoServiceContract } from 'domain/contracts/services/editor/EditorLogoServiceContract';

interface GetDigiCustomizationsLogoResponse {
    customData: {
        logo: {
            imgSrc: string; /* Base64-encoded image source */
            scale: number | null;
            linkage: {
                url: string | null;
                articleId: number | null;
                documentId: number | null;
                page: number | null;
            };
        } | null;
    };
}

interface UpdateLogoPayload {
    objCustomisation:{
        logo: Partial<{
            scale: number | null;
            imgSrc: string | null;
            linkage: {
                url: string;
                articleId: number | null;
                documentId: number | null;
                page: number | null;
            } | null;
        }>
    }
}

export default function EditorLogoService(): EditorLogoServiceContract {
    const apiService = Container.resolve(ApiService);

    async function getLogo(): Promise<EditorLogoModel | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsLogoResponse }>();

        const { customData } = digiPlatformCustomisation;

        if (!customData) {
            return null;
        }
        const { logo } = customData;

        const filename = 'logo.png';
        const defaultImageShrinkage = 100;

        return {
            logoFile: logo?.imgSrc ? { name: filename, content: logo.imgSrc } : null,
            logoShrinkage: (logo?.imgSrc && !logo?.scale) ? defaultImageShrinkage : logo?.scale,
            logoLinkUrl: logo?.linkage?.url || null,
        };
    }

    async function updateLogo(values: Partial<EditorLogoModel>): Promise<boolean> {
        const payload: UpdateLogoPayload = {
            objCustomisation: {
                logo: {
                    scale: values.logoShrinkage,
                    imgSrc: values.logoFile?.content,
                    linkage: values.logoLinkUrl
                        ? {
                            url: values.logoLinkUrl,
                            articleId: null,
                            documentId: null,
                            page: null,
                        }
                        : null,
                },
            },
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustom)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    return {
        getLogo,
        updateLogo,
    };
}
