import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { AccountModel } from 'domain/models/auth/AccountModel';
import AccountService from 'application/services/api/auth/AccountService';

export function GetAccountUseCase(): UseCaseContract<undefined, Promise<AccountModel | null>> {
    const accountService = Container.resolve(AccountService);

    async function handle(): Promise<AccountModel | null> {
        return accountService.getAccount();
    }

    return {
        handle,
    };
}
