import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import AuthService from 'application/services/api/auth/AuthService';
import { LoginModel } from 'domain/models/auth/LoginModel';

export interface LoginUseCaseProps {
    database: string,
    email: string,
    password: string
    relationId?: number,
    rememberMe?: boolean,
}

export function LoginUseCase(): UseCaseContract<LoginUseCaseProps, Promise<LoginModel | null>> {
    const authService = Container.resolve(AuthService);

    async function handle({
        database,
        email,
        password,
        relationId,
    }: LoginUseCaseProps): Promise<LoginModel | null> {
        return authService.login(database, email, password, relationId);
    }

    return {
        handle,
    };
}
