/**
 * Utilities for handling date ranges based on time periods
 */
import { TimePeriodValue, TimePeriods } from '../constants/timePeriods';

/**
 * Creates a start date by subtracting days/months and normalizes the time to midnight.
 * @param endDate
 * @param options
 */
export function createStartDate(
    endDate: Date,
    options: { days?: number; months?: number },
): Date {
    const startDate = new Date(endDate);

    if (options.days) {
        startDate.setDate(endDate.getDate() - options.days);
    }

    if (options.months) {
        const originalDay = endDate.getDate();
        startDate.setMonth(endDate.getMonth() - options.months);
        // Check for day overflow (e.g., May 31 -> April 31 becomes May 1)
        if (startDate.getDate() !== originalDay) {
            startDate.setDate(0); // Set to last day of previous month
        }
    }

    // Normalize to start of the day
    startDate.setHours(0, 0, 0, 0);
    return startDate;
}

/**
 * Calculator functions to determine date ranges based on time period values
 */
export const dateRangeCalculator: Record<TimePeriodValue, (endDate: Date) => Date> = {
    [TimePeriods.CUSTOM]: (endDate) => createStartDate(endDate, { days: 0 }),
    [TimePeriods.DAYS_7]: (endDate) => createStartDate(endDate, { days: 7 }),
    [TimePeriods.DAYS_30]: (endDate) => createStartDate(endDate, { days: 30 }),
    [TimePeriods.MONTHS_12]: (endDate) => createStartDate(endDate, { months: 12 }),
};
