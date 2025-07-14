export interface MetricsModel {
    /**
     * The URL of the newsstand where content, such as campaigns, adverts, and highlights, is displayed or managed.
     */
    url: string;

    /**
     * The publicly accessible URL for the newsstand, allowing users to view its content.
     */
    publicUrl: string;

    /**
     * The number of newsstands that exist.
     */
    newsstand: number;

    /**
     * The number of campaigns that exist.
     */
    campaigns: number;

    /**
     * The number of adverts that exist.
     */
    adverts: number;

    /**
     * The number of highlights that exist.
     */
    highlights: number;

    /**
     * The number of campaigns that are currently active and running on the platform.
     */
    activeCampaigns: number;

    /**
     * The number of campaigns that are inactive or not currently running on the platform.
     */
    inactiveCampaigns: number;

    /**
     * The number of advertisements that are currently live and visible on the platform.
     */
    activeAdverts: number;

    /**
     * The number of advertisements that are inactive or not visible on the platform.
     */
    inactiveAdverts: number;

    /**
     * The number of highlights  that are currently active and displayed.
     */
    activeHighlights: number;

    /**
     * The number of highlights that are inactive or not being displayed on the platform.
     */
    inactiveHighlights: number;
}

export interface DateRange {
    dateStart: Date | null;
    dateFinal: Date | null;
}

/**
 * Model representing a single visitor entry with date and count
 */
export interface VisitorEntry {
    date: string;
    visitors: number;
}

/**
 * Model representing visitor statistics data from the API
 */
export interface VisitorsStatisticsModel {
    /**
     * The number of new user registrations
     */
    quantityNewRegistrants: number;

    /**
     * The total number of visitors
     */
    quantityVisitors: number;

    /**
     * Formatted array of visitor entries sorted by date
     */
    visitors: VisitorEntry[] | null;
}

/**
 * Popular page entry in publication statistics
 */
export interface PopularPageEntry {
    pageNumber: number;
    fullName: string;
    articleId: number;
    seconds: number;
    minutes: number;
}

/**
 * Model representing publication page view statistics data from the API
 */
export interface PagesStatisticsModel {
    /**
     * The total number of pages viewed
     */
    totalPages: number;

    /**
     * Total view time in seconds
     */
    totalSeconds: number;

    /**
     * Total view time in minutes
     */
    totalMinutes: number;

    /**
     * Total view time in hours
     */
    totalHours: number;

    /**
     * Array of the most popular pages
     */
    popularPages: PopularPageEntry[] | null;
}

export interface Campaign {
    date: string;
    [campaignLabel: string]: number | string;
}

/**
 * Model representing campaign statistics data from the API
 */
export interface CampaignsStatisticsModel {
    quantityNewRegistrants: number;
    quantityVisitors: number;
    campaigns: Campaign[] | null;
}

/**
 * Model representing advert statistics data from the API
 */
export interface AdvertsStatisticsModel {
    clicks: ClickEntry[] | null;
    totalClicks: number;
}

/**
 * Model representing a single click entry
 */
export interface ClickEntry {
    url: string;
    quantity: number;
    label: string;
    source: string;
}

export interface CreateDigiTokenUrlModel {
    previewToken: string;
    previewUrl: string;
}
