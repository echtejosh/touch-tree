import { StorageServiceContract } from 'domain/contracts/services/StorageServiceContract';

/**
 * Storage Service for the browser's local storage.
 *
 * @constructor
 */
function LocalStorageService(): StorageServiceContract {
    /**
     * Retrieves a value from local storage by key.
     *
     * @param key The key of the item to retrieve.
     * @returns The value associated with the key, or `undefined` if not found.
     */
    function getItem(key: string): string | undefined {
        return localStorage.getItem(key) || undefined;
    }

    /**
     * Retrieves all key-value pairs from local storage.
     *
     * @returns An object containing all items in local storage.
     */
    function getAll(): Record<string, string | undefined> {
        const { length } = localStorage;

        const items = Array.from({ length }, (_, index): Array<string | undefined> => {
            const key = localStorage.key(index)!;

            return [
                key,
                getItem(key),
            ];
        });

        return Object.fromEntries(items);
    }

    /**
     * Adds a value to local storage by key.
     *
     * @param key The key of the item to add.
     * @param value The value to be stored.
     */
    function setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    /**
     * Removes an item from local storage by key.
     *
     * @param key The key of the item to remove.
     */
    function removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Clears all items from local storage.
     */
    function clearAll(): void {
        localStorage.clear();
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
 * @see LocalStorageService
 */
export default LocalStorageService;
