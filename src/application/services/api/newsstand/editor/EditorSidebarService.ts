import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import { EditorSidebarModel } from 'domain/models/newsstand/NewsstandModel';
import endpoints from 'infrastructure/routes/endpoints';
import { EditorSidebarServiceContract } from 'domain/contracts/services/editor/EditorSidebarServiceContract';

interface GetDigiCustomizationsSidebarResponse {
    customData: {
        privatePdfBackgroundSrc: string;
    };
    relationDetails: {
        documentTitle: string | null;
    }
}

interface UpdateSidebarPayload {
    objCustomisation?: {
        privatePdfBackgroundSrc: string | null;
    }
    documentTitle?: string | null;
}

export default function EditorSidebarService(): EditorSidebarServiceContract {
    const apiService = Container.resolve(ApiService);

    async function getSidebar(): Promise<EditorSidebarModel | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsSidebarResponse }>();

        const { customData, relationDetails } = digiPlatformCustomisation;

        if (!customData || !relationDetails) {
            return null;
        }

        return {
            title: relationDetails.documentTitle,
            sidebarBackgroundImg: customData.privatePdfBackgroundSrc
                ? { name: 'sidebar-banner.png', content: customData.privatePdfBackgroundSrc }
                : null,
        };
    }

    async function updateSidebar(values: Partial<EditorSidebarModel>): Promise<boolean> {
        const payload: UpdateSidebarPayload = {
            objCustomisation: values.sidebarBackgroundImg
                ? { privatePdfBackgroundSrc: values.sidebarBackgroundImg.content }
                : undefined,
            documentTitle: values.title,
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustom)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    return {
        getSidebar,
        updateSidebar,
    };
}
