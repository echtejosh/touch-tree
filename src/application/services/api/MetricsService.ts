import { ApiService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import endpoints from 'infrastructure/routes/endpoints';
import {
    DateRange,
    MetricsModel,
    VisitorsStatisticsModel,
    PagesStatisticsModel,
    CampaignsStatisticsModel,
    AdvertsStatisticsModel,
    CreateDigiTokenUrlModel, Campaign,
} from 'domain/models/MetricsModel';
import { MetricsServiceContract } from 'domain/contracts/services/MetricsServiceContract';
import url from 'utils/url';
import dateUtils from 'utils/date';
import LocaleService from 'infrastructure/services/locale/LocaleService';

interface GetMetricsResponse {
    digiUrl: string,
    digiUrlAccess: string,
    quantityDepartments: number,
    quantityActiveCampaigns: number,
    quantityInactiveCampaigns: number,
    quantityActiveAdverts: number,
    quantityInactiveAdverts: number,
    quantityActiveHighlights: number,
    quantityInactiveHighlights: number,
    quantityActiveArticles: number,
    quantityInactiveArticles: number,
}

interface GetVisitorsResponse {
    quantityNewRegistrants: number;
    quantityVisitors: number;
    visitors: Record<string, number> | null;
}

interface GetPublicationsResponse {
    digiStatisticsPageViews: {
        totalPages: number,
        totalSeconds: number,
        totalMinutes: number,
        totalHours: number,
        popularPages: Array<{
            pageNumber: number,
            fullName: string,
            articleId: number,
            seconds: number
            minutes: number;
        }> | null;
    }
}

interface GetCampaignsResponse {
    digiStatisticsCampaigns: {
        quantityNewRegistrants: number;
        quantityVisitors: number;
        campaigns: Record<string, {
            campaignId: number[],
            campaignLabel: string[],
            quantity: number[],
        }> | null;
    }
}
interface GetAdvertsResponse {
    digiStatisticsClicks: {
        clicks: Array<{
            url: string;
            quantity: number;
            label: string;
            source: string;
        }> | null,
        totalClicks: number
    }
}

interface CreateDigiTokenResponse {
    previewToken: string;
    previewUrl: string;
}

/**
 * Service for managing metrics.
 *
 * @constructor
 */
export default function MetricsService(): MetricsServiceContract {
    const apiService = Container.resolve(ApiService);
    const localeService = Container.resolve(LocaleService);

    /**
     * Fetches the metric data from the API.
     *
     * @returns A promise that resolves to the metric data or `null` if the metrics is not found.
     */
    async function getMetrics(): Promise<MetricsModel | null> {
        const { dashboard: metrics } = await apiService.request(endpoints.getMetrics)
            .send<{ dashboard: GetMetricsResponse }>();

        if (!metrics) {
            return null;
        }

        return {
            url: url.decache(metrics.digiUrl),
            publicUrl: metrics.digiUrlAccess,
            newsstand: metrics.quantityDepartments,
            campaigns: metrics.quantityActiveCampaigns + metrics.quantityInactiveCampaigns,
            adverts: metrics.quantityActiveAdverts + metrics.quantityInactiveAdverts,
            highlights: metrics.quantityActiveHighlights + metrics.quantityInactiveHighlights,
            activeCampaigns: metrics.quantityActiveCampaigns,
            inactiveCampaigns: metrics.quantityInactiveCampaigns,
            activeAdverts: metrics.quantityActiveAdverts,
            inactiveAdverts: metrics.quantityInactiveAdverts,
            activeHighlights: metrics.quantityActiveHighlights,
            inactiveHighlights: metrics.quantityInactiveHighlights,
        };
    }

    async function getVisitors({
        dateStart,
        dateFinal,
    }: DateRange): Promise<VisitorsStatisticsModel | null> {
        const { digiStatisticsVisitors } = await apiService.request(endpoints.getVisitorsStatistics)
            .send<{ digiStatisticsVisitors: GetVisitorsResponse }>({
                dateOffset: dateUtils.unix(dateStart),
                dateFinal: dateUtils.unix(dateFinal),
            });

        if (!digiStatisticsVisitors) {
            return null;
        }

        const visitors = digiStatisticsVisitors.visitors
            ? Object.entries(digiStatisticsVisitors.visitors)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([_date, _visitors]) => ({
                    date: dateUtils.formatDate(new Date(_date), localeService.getLocale(), { month: 'short', day: 'numeric' }),
                    visitors: _visitors,
                }))
            : null;

        return {
            ...digiStatisticsVisitors,
            visitors,
        };
    }

    async function getPages({
        dateStart,
        dateFinal,
    }: DateRange): Promise<PagesStatisticsModel | null> {
        const { digiStatisticsPageViews } = await apiService.request(endpoints.getPublicationsStatistics)
            .send<GetPublicationsResponse>({
                dateOffset: dateUtils.unix(dateStart),
                dateFinal: dateUtils.unix(dateFinal),
            });

        if (!digiStatisticsPageViews) {
            return null;
        }

        const popularPages = digiStatisticsPageViews.popularPages?.map((page) => ({
            ...page,
            fullName: page.fullName.length > 50
                ? `${page.fullName.slice(0, 47)}...`
                : page.fullName,
        })) || null;

        return {
            ...digiStatisticsPageViews,
            popularPages,
        };
    }

    async function getCampaigns({
        dateStart,
        dateFinal,
    }: DateRange): Promise<CampaignsStatisticsModel | null> {
        const { digiStatisticsCampaigns } = await apiService.request(endpoints.getCampaignsStatistics)
            .send<GetCampaignsResponse>({
                dateOffset: dateUtils.unix(dateStart),
                dateFinal: dateUtils.unix(dateFinal),
            });

        if (!digiStatisticsCampaigns) {
            return null;
        }

        const transformData = (campaigns: Record<string, { campaignLabel: string[], quantity: number[] }>) => {
            return Object.entries(campaigns)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([date, { campaignLabel, quantity }]) => {
                    const formattedDate = dateUtils.formatDate(new Date(date), localeService.getLocale(), { month: 'short', day: 'numeric' });

                    const dataPoint: Campaign = { date: formattedDate };

                    const sortedEntries = campaignLabel
                        .map((label, index) => ({ label, value: quantity[index] }))
                        .sort((a, b) => a.value - b.value);

                    sortedEntries.forEach(({ label, value }) => {
                        dataPoint[label] = value;
                    });

                    return dataPoint;
                });
        };

        return {
            ...digiStatisticsCampaigns,
            campaigns: digiStatisticsCampaigns.campaigns
                ? [...transformData(digiStatisticsCampaigns.campaigns)]
                : null,
        };
    }

    async function getAdverts({
        dateStart,
        dateFinal,
    }: DateRange): Promise<AdvertsStatisticsModel | null> {
        const { digiStatisticsClicks } = await apiService.request(endpoints.getAdvertsStatistics)
            .send<GetAdvertsResponse>({
                dateOffset: dateUtils.unix(dateStart),
                dateFinal: dateUtils.unix(dateFinal),
            });

        if (!digiStatisticsClicks) {
            return null;
        }

        const processedClicks = digiStatisticsClicks.clicks?.map((click) => ({
            ...click,
        })) || null;

        return {
            clicks: processedClicks,
            totalClicks: digiStatisticsClicks.totalClicks,
        };
    }

    async function createDigiTokenUrl(): Promise<CreateDigiTokenUrlModel | null> {
        const { previewToken, previewUrl } = await apiService.request(endpoints.createDigiTokenUrl)
            .send<CreateDigiTokenResponse>();

        if (!previewUrl) {
            return null;
        }

        return { previewToken, previewUrl };
    }

    return {
        getMetrics,
        getVisitors,
        getPages,
        getCampaigns,
        getAdverts,
        createDigiTokenUrl,
    };
}
