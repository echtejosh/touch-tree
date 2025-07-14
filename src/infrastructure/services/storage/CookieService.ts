import Cookies from 'js-cookie';
import { StorageServiceContract } from 'domain/contracts/services/StorageServiceContract';

/**
 * Options to provide for adding a new cookie.
 */
export interface CookieOptions {
    /**
     * The expiration time of the cookie.
     *
     * Can be specified as a number (in days) or a Date object.
     */
    expires?: number | Date;

    /**
     * The path where the cookie is accessible.
     *
     * If not specified, defaults to the current path of the document.
     */
    path?: string;

    /**
     * The domain for which the cookie is valid.
     *
     * If not specified, defaults to the domain of the calling script.
     */
    domain?: string;

    /**
     * Indicates whether the cookie should only be transmitted
     * over secure HTTPS connections.
     */
    secure?: boolean;
}

/**
 * Storage Service for browser cookies.
 *
 * @constructor
 */
function CookieService(): StorageServiceContract {
    /**
     * Retrieves all cookies as an object.
     *
     * @returns An object containing all cookies.
     */
    function getAll(): Record<string, string | undefined> {
        return Cookies.get();
    }

    /**
     * Retrieves a value from cookies by key.
     *
     * @param key The key of the cookie to retrieve.
     * @returns The value associated with the key, or `undefined` if not found.
     */
    function getItem(key: string): string | undefined {
        return Cookies.get(key);
    }

    /**
     * Sets a new cookie or updates an existing cookie by its key,
     * with additional options for the cookie.
     *
     * @param key The key of the cookie to set.
     * @param value The value to be stored.
     * @param options Additional options for the cookie (optional).
     */
    function setItem(key: string, value: string, options?: CookieOptions): void {
        Cookies.set(key, value, options);
    }

    /**
     * Removes a cookie by key.
     *
     * @param key The key of the cookie to remove.
     */
    function removeItem(key: string): void {
        Cookies.remove(key);
    }

    /**
     * Clears all cookies.
     */
    function clearAll(): void {
        Object.keys(Cookies.get())
            .forEach((key: string): void => removeItem(key));
    }

    return {
        getAll,
        getItem,
        setItem,
        removeItem,
        clearAll,
    };
}

/**
 * @see CookieService
 */
export default CookieService;
