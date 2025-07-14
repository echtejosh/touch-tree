/**
 * Filters the properties of an object based on a filter function.
 *
 * @param obj The object or array-like structure to filter.
 * @param predicate The filtering function.
 * @returns A new object with the filtered entries.
 */
function filter<T>(
    obj: ArrayLike<T> | Record<string, T>,
    predicate: (value: T, key: string) => boolean,
): Record<string, T> {
    return Object.fromEntries(
        Object
            .entries(obj)
            .filter(([key, value]): boolean => !predicate(value as T, key)),
    );
}

/**
 * Serializes an object into a new object where all values are converted to strings.
 *
 * @param obj The object or array-like structure to serialize.
 * @returns A new object with all values converted to string format.
 */
function serialize<T>(obj: ArrayLike<T> | Record<string, T>): Record<string, string> {
    return Object.fromEntries(
        Object
            .entries(obj)
            .map(([key, value]): string[] => [key, String(value)]),
    );
}

/**
 * Removes specified keys from an object and returns a new object.
 *
 * @param obj The original object from which keys will be removed.
 * @param keys An array of keys to remove from the object.
 * @returns A new object without the specified keys.
 */
function remove<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return Object.fromEntries(
        Object
            .entries(obj)
            .filter(([key]): boolean => !keys.includes(key as K)),
    ) as Omit<T, K>;
}

export default {
    remove,
    filter,
    serialize,
};
