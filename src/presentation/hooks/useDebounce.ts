import { useEffect, DependencyList } from 'react';

/**
 * A custom hook to debounce the execution of a function.
 *
 * @param fn - The function to execute after the debounce time.
 * @param delay - The debounce delay in milliseconds.
 * @param deps - The dependency list that triggers the effect.
 */
export default function useDebounce(
    fn: () => void,
    delay: number,
    deps: DependencyList = [],
) {
    useEffect(() => {
        const timeout = setTimeout(fn, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [fn, delay, ...deps]);
}
