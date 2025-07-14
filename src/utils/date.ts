function unix(input: Date | null): number | null;
function unix(input: number | null): Date | null;

function unix(input: Date | number | null): number | Date | null {
    if (input === null) {
        return input;
    }

    if (input instanceof Date) {
        // Adjust for local timezone offset so that the result
        // represents the local time as UTC (preserving local calendar time)
        const offsetMs = input.getTimezoneOffset() * 60 * 1000;
        const adjustedTime = input.getTime() - offsetMs;

        return Math.floor(adjustedTime / 1000);
    }

    return new Date(input * 1000);
}

/**
 * Custom isEqual function to check if two dates are equal.
 *
 * @param date The first date to compare.
 * @param compare The second date to compare.
 * @returns `true` if the two dates are equal, otherwise `false`.
 */
function isEqual(date: Date, compare: Date): boolean {
    if (!date || !compare) {
        return false;
    }

    return date.getTime() === compare.getTime();
}

/**
 * Custom isBefore function to check if `date` is before `compare`.
 *
 * @param date The date to compare.
 * @param compare The date to compare against.
 * @returns `true` if the date is before the compare date, otherwise `false`.
 */
function isBefore(date: Date, compare: Date): boolean {
    if (!date || !compare) {
        return false;
    }

    return date.getTime() < compare.getTime();
}

/**
 * Custom isAfter function to check if `date` is after `compare`.
 *
 * @param date The date to compare.
 * @param compare The date to compare against.
 * @returns `true` if the date is after the compare date, otherwise `false`.
 */
function isAfter(date: Date, compare: Date): boolean {
    if (!date || !compare) {
        return false;
    }

    return date.getTime() > compare.getTime();
}

/**
 * Checks if the first date is before or equal to the second date.
 *
 * @param date The date to compare.
 * @param compare The date to compare against.
 * @returns `true` if the date is before or on the same day as compare, otherwise `false`.
 */
function isBeforeOrEqual(date: Date, compare: Date): boolean {
    if (!date || !compare) {
        return false;
    }

    return isBefore(date, compare) || isEqual(date, compare);
}

/**
 * Checks if the first date is after or equal to the second date.
 *
 * @param date The date to compare.
 * @param compare The date to compare against.
 * @returns `true` if the date is after or on the same day as compare, otherwise `false`.
 */
function isAfterOrEqual(date: Date, compare: Date): boolean {
    if (!date || !compare) {
        return false;
    }

    return isAfter(date, compare) || isEqual(date, compare);
}

/**
 * Checks if a date is within a given date range, inclusive.
 *
 * @param date The date to check.
 * @param start The start of the range.
 * @param end The end of the range.
 * @returns `true` if the date is between or on the start and end dates, otherwise `false`.
 */
function inRangeOf(date: Date, start: Date, end: Date): boolean {
    return isAfterOrEqual(date, start) && isBeforeOrEqual(date, end);
}

/**
 * Format a date according to the specified locale and options
 *
 * @param date The date to format
 * @param locale The locale to use for formatting (e.g., 'en-US', 'fr-FR')
 * @param options Intl.DateTimeFormatOptions to customize formatting
 * @param fallback Fallback value if date is null
 * @returns Formatted date string
 */
function formatDate(
    date: Date | null,
    locale: string = 'nl-Nl',
    options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' },
    fallback: string = String(),
): string {
    return date?.toLocaleDateString(locale, options) ?? fallback;
}

export default {
    unix,
    inRangeOf,
    isAfter,
    isBefore,
    isAfterOrEqual,
    isBeforeOrEqual,
    isEqual,
    formatDate,
};
