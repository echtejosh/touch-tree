import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import AuthService from 'application/services/api/auth/AuthService';

export function LogoutUseCase(): UseCaseContract<undefined, void> {
    const authService = Container.resolve(AuthService);

    function handle(): void {
        authService.logout();
    }

    return {
        handle,
    };
}
