/**
 * Standardized time period values used across the application
 */
export const TimePeriods = {
    CUSTOM: 0,
    DAYS_7: 1,
    DAYS_30: 2,
    MONTHS_12: 3,
} as const;

export type TimePeriodValue = typeof TimePeriods[keyof typeof TimePeriods];

export const DEFAULT_TIME_PERIOD = TimePeriods.DAYS_30;

/**
 * List of standard time periods to display in selectors (excluding CUSTOM)
 */
export const STANDARD_TIME_PERIODS: TimePeriodValue[] = [
    TimePeriods.MONTHS_12,
    TimePeriods.DAYS_30,
    TimePeriods.DAYS_7,
];
