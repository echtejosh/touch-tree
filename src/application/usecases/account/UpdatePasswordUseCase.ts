import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import AccountService from 'application/services/api/auth/AccountService';

export interface UpdatePasswordUseCaseProps {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
}

export function UpdatePasswordUseCase(): UseCaseContract<UpdatePasswordUseCaseProps, Promise<boolean>> {
    const accountService = Container.resolve(AccountService);

    async function handle(props: UpdatePasswordUseCaseProps): Promise<boolean> {
        return accountService.updatePassword(props);
    }

    return {
        handle,
    };
}
