import { UseQueryOptions, UseQueryResult, useQuery, QueryKey } from '@tanstack/react-query';
import AuthService from 'application/services/api/auth/AuthService';
import Container from 'infrastructure/services/Container';

/**
 * A hook for fetching data from a specified endpoint using a query function.
 *
 * @param fn A function that returns a promise for fetching the data from the endpoint.
 * @param deps An optional array of dependencies.
 * @param options Additional React Query options to merge with default options.
 *
 * @returns An object containing the result of the fetch operation.
 */
export default function useQueryDecorator<T>(
    fn: () => Promise<T>,
    deps: QueryKey,
    options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
): UseQueryResult<T> {
    const authService = Container.resolve(AuthService);

    const _options: UseQueryOptions<T> = {
        queryKey: [authService.getToken(), deps],
        queryFn: fn,
        ...options,
    };

    return useQuery(_options);
}
