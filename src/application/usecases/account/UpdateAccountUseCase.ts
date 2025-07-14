import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import AccountService from 'application/services/api/auth/AccountService';

export interface UpdateAccountUseCaseProps {
    id: number;
    contactId: number | undefined;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    businessNumber: string;
    vatNumber: string;
}

export function UpdateAccountUseCase(): UseCaseContract<UpdateAccountUseCaseProps, Promise<boolean>> {
    const accountService = Container.resolve(AccountService);

    async function handle(values: UpdateAccountUseCaseProps): Promise<boolean> {
        return accountService.updateAccount(values);
    }

    return {
        handle,
    };
}
