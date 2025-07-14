import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import { EditorColorsModel } from 'domain/models/newsstand/NewsstandModel';
import endpoints from 'infrastructure/routes/endpoints';
import { EditorColorsServiceContract } from 'domain/contracts/services/editor/EditorColorsServiceContract';

interface GetDigiCustomizationsColorsResponse {
    customData: {
        colorMainBackground: string | null;
        colorMainFont: string | null;
        colorHeaderBackground: string | null;
        colorFooterBackground: string | null;
        colorHeaderFont: string | null;
        colorFooterFont: string | null;
        colorContainerFont: string | null;
        colorContainerBackground: string | null;
        colorHighlightBackground: string | null;
        colorLineBackground: string | null;
    };
    defaultColours: {
        colorMainBackground: string;
        colorMainFont: string;
        colorHeaderBackground: string;
        colorFooterBackground: string;
        colorHeaderFont: string;
        colorFooterFont: string;
        colorContainerFont: string;
        colorContainerBackground: string;
        colorHighlightBackground: string;
        colorLineBackground: string;
    };
}

interface UpdateColorsPayload {
    objCustomisation: Partial<{
        colorMainBackground: string;
        colorMainFont: string;
        colorHighlightBackground: string;
        colorHeaderBackground: string;
        colorHeaderFont: string;
        colorFooterBackground: string;
        colorFooterFont: string;
        colorContainerBackground: string;
        colorContainerFont: string;
        colorLineBackground: string;
    }>;
}

export default function EditorColorsService(): EditorColorsServiceContract {
    const apiService = Container.resolve(ApiService);

    async function getColors(): Promise<EditorColorsModel | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsColorsResponse }>();

        const { customData, defaultColours } = digiPlatformCustomisation;

        if (!customData) {
            return null;
        }

        return {
            pageBackgroundColor: customData.colorMainBackground ?? defaultColours.colorMainBackground,
            pageFontColor: customData.colorMainFont ?? defaultColours.colorMainFont,
            pageHighlightColor: customData.colorHighlightBackground ?? defaultColours.colorHighlightBackground,
            headerBackgroundColor: customData.colorHeaderBackground ?? defaultColours.colorHeaderBackground,
            headerFontColor: customData.colorHeaderFont ?? defaultColours.colorHeaderFont,
            footerBackgroundColor: customData.colorFooterBackground ?? defaultColours.colorFooterBackground,
            footerFontColor: customData.colorFooterFont ?? defaultColours.colorFooterFont,
            cardBackgroundColor: customData.colorContainerBackground ?? defaultColours.colorContainerBackground,
            cardFontColor: customData.colorContainerFont ?? defaultColours.colorContainerFont,
            separatorColor: customData.colorLineBackground ?? defaultColours.colorLineBackground,
        };
    }

    async function getDefaultColors(): Promise<EditorColorsModel> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<{ digiPlatformCustomisation: GetDigiCustomizationsColorsResponse }>();

        const { defaultColours } = digiPlatformCustomisation;

        return {
            pageBackgroundColor: defaultColours.colorMainBackground,
            pageFontColor: defaultColours.colorMainFont,
            pageHighlightColor: defaultColours.colorHighlightBackground,
            headerBackgroundColor: defaultColours.colorHeaderBackground,
            headerFontColor: defaultColours.colorHeaderFont,
            footerBackgroundColor: defaultColours.colorFooterBackground,
            footerFontColor: defaultColours.colorFooterFont,
            cardBackgroundColor: defaultColours.colorContainerBackground,
            cardFontColor: defaultColours.colorContainerFont,
            separatorColor: defaultColours.colorLineBackground,
        };
    }

    async function updateColors(values: Partial<EditorColorsModel>): Promise<boolean> {
        const payload: UpdateColorsPayload = {
            objCustomisation: {
                colorMainBackground: values.pageBackgroundColor,
                colorMainFont: values.pageFontColor,
                colorHighlightBackground: values.pageHighlightColor,
                colorHeaderBackground: values.headerBackgroundColor,
                colorHeaderFont: values.headerFontColor,
                colorFooterBackground: values.footerBackgroundColor,
                colorFooterFont: values.footerFontColor,
                colorContainerBackground: values.cardBackgroundColor,
                colorContainerFont: values.cardFontColor,
                colorLineBackground: values.separatorColor,
            },
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustom)
            .send<{ success: boolean }>({ ...payload });

        return success || false;
    }

    return {
        getColors,
        updateColors,
        getDefaultColors,
    };
}
