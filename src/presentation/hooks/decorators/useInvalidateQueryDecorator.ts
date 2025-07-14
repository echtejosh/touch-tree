import { QueryClient, QueryKey } from '@tanstack/react-query';
import Container from 'infrastructure/services/Container';
import AuthService from 'application/services/api/auth/AuthService';

export default function useInvalidateQueryDecorator(deps: QueryKey): void {
    const authService = Container.resolve(AuthService);

    Container.resolve(QueryClient).invalidateQueries({ queryKey: [authService.getToken(), deps] }).then(undefined);
}
