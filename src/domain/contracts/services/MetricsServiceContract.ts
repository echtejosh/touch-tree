import {
    DateRange,
    MetricsModel,
    VisitorsStatisticsModel,
    PagesStatisticsModel,
    CampaignsStatisticsModel,
    AdvertsStatisticsModel,
    CreateDigiTokenUrlModel,
} from 'domain/models/MetricsModel';

/**
 * Contract for the MetricsService.
 */
export interface MetricsServiceContract {
    /**
     * Fetches the metric data from the API.
     *
     * @returns A promise that resolves to the metric data or `null` if not found.
     */
    getMetrics(): Promise<MetricsModel | null>;

    /**
     * Fetches visitor statistics for a given date range.
     *
     * @param dateRange - The date range to fetch visitor statistics for
     * @returns A promise that resolves to visitor statistics or `null` if not found
     */
    getVisitors: (dateRange: DateRange) => Promise<VisitorsStatisticsModel | null>;

    /**
     * Fetches page view statistics from the API.
     *
     * @param dateRange - The date range to fetch page view statistics for
     * @returns A promise that resolves to page view statistics or `null` if not found
     */
    getPages: (dateRange: DateRange) => Promise<PagesStatisticsModel | null>;

    /**
     * Fetches campaign statistics for a given date range.
     *
     * @param dateRange - The date range to fetch campaign statistics for
     * @returns A promise that resolves to campaign statistics or `null` if not found
     */
    getCampaigns(dateRange: DateRange): Promise<CampaignsStatisticsModel | null>;

    /**
     * Fetches advert statistics for a given date range.
     *
     * @param dateRange - The date range to fetch advert statistics for
     * @returns A promise that resolves to advert statistics or `null` if not found
     */
    getAdverts(dateRange: DateRange): Promise<AdvertsStatisticsModel | null>;

    createDigiTokenUrl(): Promise<CreateDigiTokenUrlModel | null>;
}
