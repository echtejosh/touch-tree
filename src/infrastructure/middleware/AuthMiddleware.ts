import { EndpointShape, MiddlewareContract, RequestBag } from 'domain/contracts/middleware/MiddlewareContract';
import Container from 'infrastructure/services/Container';
import AuthService from 'application/services/api/auth/AuthService';

export default function AuthMiddleware(): MiddlewareContract {
    const authService = Container.resolve(AuthService);

    function handle(request: RequestBag, endpoint: EndpointShape): RequestBag {
        const token = authService.getToken();
        const requireAuth = endpoint.token ?? true;

        if (requireAuth && token) {
            request.params.set('token', token);
        }

        return request;
    }

    return {
        handle,
    };
}
