import { FetchQueryOptions, QueryClient, QueryKey } from '@tanstack/react-query';
import Container from 'infrastructure/services/Container';
import AuthService from 'application/services/api/auth/AuthService';

/**
 * A hook for prefetching data from a specified endpoint using a query function.
 *
 * @param fn A function that returns a promise for fetching the data from the endpoint.
 * @param deps An optional array of dependencies.
 *
 * @returns An object containing the result of the fetch operation.
 */
export default function usePrefetchQueryDecorator<T>(fn: () => Promise<T>, deps: QueryKey): void {
    const authService = Container.resolve(AuthService);

    const options: FetchQueryOptions<T> = {
        queryKey: [authService.getToken(), deps],
        queryFn: fn,
    };

    Container.resolve(QueryClient)
        .prefetchQuery(options)
        .then(undefined);
}
