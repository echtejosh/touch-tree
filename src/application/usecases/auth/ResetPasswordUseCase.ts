import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import AuthService from 'application/services/api/auth/AuthService';

export interface ResetPasswordUseCaseProps {
    database: string,
    email: string,
}

export function ResetPasswordUseCase(): UseCaseContract<ResetPasswordUseCaseProps, Promise<void>> {
    const authService = Container.resolve(AuthService);

    async function handle({
        database,
        email,
    }: ResetPasswordUseCaseProps): Promise<void> {
        await authService.resetPassword(database, email);
    }

    return {
        handle,
    };
}
