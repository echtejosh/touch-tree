/**
 * Contract for storage services for our application.
 *
 * This interface defines the methods that any storage service.
 */
export interface StorageServiceContract {
    /**
     * Retrieves all key-value pairs from the storage.
     *
     * @returns An object containing all items in the storage.
     */
    getAll(): Record<string, string | undefined>;

    /**
     * Retrieves a value from the storage by its key.
     *
     * @param key The key of the item to retrieve from storage.
     * @returns The value associated with the key, or `undefined` if the key is not found.
     */
    getItem(key: string): string | undefined;

    setItem(key: string, value: string): void;

    /**
     * Set a new key-value pair to the storage.
     *
     * @param key The key under which the value is to be stored.
     * @param value The value to be stored.
     * @param options The options.
     */
    setItem(key: string, value: string, options?: unknown): void;

    /**
     * Removes an item from the storage by its key.
     *
     * @param key The key of the item to remove from storage.
     */
    removeItem(key: string): void;

    /**
     * Clears all items from the storage.
     *
     * This method will remove all key-value pairs.
     */
    clearAll(): void;
}
