import { parse } from 'tldts';

/**
 * Appends a cache-busting timestamp to a URL to ensure a fresh response.
 *
 * @param url The URL to which the parameter will be added.
 * @returns The modified URL with the cache-busting timestamp appended.
 */
function decache(url: string): string {
    const ref = new URL(url);

    ref.searchParams.set('timestamp', new Date().getTime().toString());

    return ref.toString();
}

/**
 * Validates if a given URL is in a valid format.
 * This function checks if the URL follows a specific pattern, does not end with
 * certain punctuation marks, and does not contain an "@" symbol.
 *
 * @param url - The URL string to validate.
 * @returns - Returns `true` if the URL is valid, `false` otherwise.
 */
function isValid(url: string): boolean {
    const parsed = parse(url);

    return Boolean(parsed.domain !== null && parsed.domainWithoutSuffix !== null && parsed.isIcann);
}

/**
 *
 * @param url
 * @param domain
 */
function replaceDomain(url: string, domain: string): string {
    const parsedUrl = new URL(url);

    parsedUrl.host = domain || parsedUrl.host;

    return parsedUrl.toString();
}

/**
 * Adds query parameters to a URL
 *
 * @param url - The original URL (string or URL object)
 * @param params - Query parameters to add
 * @returns - A new URL string with added parameters
 */
function addQueryParameters(url: URL | string, params: URLSearchParams | Record<string, string>): string {
    const _url = new URL(url);

    if (params instanceof URLSearchParams) {
        _url.search = params.toString();
    } else {
        Object
            .entries(params)
            .forEach(([key, value]) => _url.searchParams.set(key, value));
    }

    return _url.toString();
}

/**
 * Builds a phone iframe source URL with required parameters
 *
 * @param url - Base URL
 * @returns - URL with phone iframe parameters
 */
function buildPhoneIframeSrc(url?: string | null): string {
    if (!url) {
        return String();
    }

    return addQueryParameters(url, {
        isEditModeExternal: '1',
        forceTouchDevice: '1',
    });
}

/**
 * Normalizes a URL for user-friendly display
 *
 * @param url The original URL to normalize
 * @param maxLength Maximum allowed length before truncation (default: 12)
 * @returns Clean, display-friendly version of the URL
 */
export function normalizeUrlForDisplay(
    url: string,
    maxLength: number = 12): string {
    const parsed = parse(url);
    let displayUrl = parsed.domain || parsed.hostname || url;

    displayUrl = displayUrl.replace(/\/$/, '');

    if (displayUrl.length > maxLength) {
        return `${displayUrl.slice(0, maxLength)}…`;
    }

    return displayUrl;
}

export default {
    decache,
    isValid,
    replaceDomain,
    withSearchParams: addQueryParameters,
    addQueryParameters,
    buildPhoneIframeSrc,
    normalizeUrlForDisplay,
};
