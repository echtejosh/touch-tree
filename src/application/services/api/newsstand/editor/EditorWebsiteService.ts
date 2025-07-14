import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import { EditorWebsiteModel } from 'domain/models/newsstand/NewsstandModel';
import endpoints from 'infrastructure/routes/endpoints';
import { EditorWebsiteServiceContract } from 'domain/contracts/services/editor/EditorWebsiteServiceContract';

interface GetDigiCustomizationsWebsiteResponse {
    customData: {
        faviconSrc: string;
        webTitle: string | null;
    };
}

interface UpdateWebsitePayload {
    objCustomisation: {
        faviconSrc?: string | null,
        webTitle?: string | null,
    }
}

export default function EditorWebsiteService(): EditorWebsiteServiceContract {
    const apiService = Container.resolve(ApiService);

    async function getFavicon(): Promise<EditorWebsiteModel | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsWebsiteResponse }>();

        const { customData } = digiPlatformCustomisation;

        if (!customData) {
            return null;
        }

        return {
            title: customData.webTitle,
            favicon: customData.faviconSrc
                ? { name: 'icon.png', content: customData.faviconSrc }
                : null,
        };
    }

    async function updateFavicon(values: Partial<EditorWebsiteModel>): Promise<boolean> {
        const payload: UpdateWebsitePayload = {
            objCustomisation: {
                webTitle: values.title,
                faviconSrc: values.favicon?.content,
            },
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustom)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    return {
        getFavicon,
        updateFavicon,
    };
}
