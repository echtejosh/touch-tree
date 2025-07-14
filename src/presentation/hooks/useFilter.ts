import { useState, useMemo } from 'react';

/**
 * Filter function.
 */
export type FilterFn<T> = (item: T) => boolean;

/**
 * A hook for applying both search and custom filters to a dataset.
 *
 * @param dataset The dataset to be filtered.
 */
export default function useFilter<T>(dataset: T[]) {
    const [filters, setFilters] = useState<{ [key: string]: FilterFn<T> }>({});
    const [fields, setFields] = useState<(keyof T)[]>([]);
    const [term, setTerm] = useState<string>(String());

    /**
     * Adds or replaces a custom filter function.
     *
     * @param key A unique key to identify the filter.
     * @param callback A filter function that takes an item and returns a boolean.
     */
    function setFilter(key: string, callback: FilterFn<T>): void {
        setFilters((prev): Record<string, FilterFn<T>> => {
            return {
                ...prev,
                [key]: callback,
            };
        });
    }

    /**
     * Removes a filter function by its key.
     *
     * @param key The key of the filter to remove.
     */
    function removeFilter(key: string): void {
        setFilters((prev): Record<string, FilterFn<T>> => {
            const {
                [key]: _,
                ...rest
            } = prev;

            return rest;
        });
    }

    /**
     * Sets the search query string and the fields to search on.
     *
     * @param _term The search query string.
     * @param select
     */
    function setSearch(_term: string, select: (keyof T)[]): void {
        setFields(select || []);
        setTerm(_term);
    }

    /**
     * Get filtered.
     */
    function filtered(): T[] {
        const _term = term.toLowerCase();

        return dataset.filter((item): boolean => {
            let filter: boolean;

            if (fields.length) {
                filter = fields.some((field): boolean => String(item[field])
                    .toLowerCase()
                    .includes(_term),
                );
            } else {
                filter = Object
                    .values(item as keyof T)
                    .some((val): boolean => String(val)
                        .toLowerCase()
                        .includes(_term));
            }

            return filter && Object
                .values(filters)
                .every((fn): boolean => fn(item));
        });
    }

    const _filtered = useMemo(filtered, [dataset, filters, fields, term]);

    return {
        setSearch,
        search: term,
        filtered: _filtered,
        setFilter,
        removeFilter,
    };
}
