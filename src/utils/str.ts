import { Base64 } from 'js-base64';

/**
 * Capitalizes the first letter of the given string.
 *
 * @param str The input string to capitalize.
 * @returns The input string with the first letter capitalized.
 */
function capitalize(str: string): string {
    if (!str) return String();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 *
 * @param str
 * @param length
 * @param ellipsis
 */
function truncate(str: string, length: number, ellipsis?: string): string {
    if (str.length <= length) {
        return str;
    }

    return str.slice(0, length) + (ellipsis || '...');
}

/**
 *
 * @param str
 */
function decodeBase64(str: string): string {
    return new TextDecoder().decode(Uint8Array.from(atob(str), (c) => c.charCodeAt(0)));
}

/**
 *
 * @param str
 */
function encodeToBase64(str: string): string {
    return Base64.encode(str);
    // const encoder = new TextEncoder();
    // const data = encoder.encode(str);
    // console.log(data);
    // return btoa(String.fromCharCode(...Array.from(data)));
}

export default {
    truncate,
    capitalize,
    decodeBase64,
    encodeToBase64,
};
