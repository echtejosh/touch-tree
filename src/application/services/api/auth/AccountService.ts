import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import endpoints from 'infrastructure/routes/endpoints';
import { AccountModel } from 'domain/models/auth/AccountModel';
import { PasswordModel } from 'domain/models/auth/PasswordModel';
import { ApiResponse } from 'infrastructure/services/types';

interface GetAccountResponse {
    relation: {
        id: number;
        businessNumber: string;
        vatNumber: string;
        names: {
            company: string;
        };
        createdByUserName: string | null;
        modifiedByUserName: string;
        addresses: {
            correspondence: {
                contactId: number;
                firstName: string;
                middleName: string | null;
                lastName: string;
                email: string;
            };
        };
        digiUrl: string;
    };
}

export default function AccountService() {
    const apiService = Container.resolve(ApiService);

    async function getAccount() {
        const { relation } = await apiService.request(endpoints.getAccount)
            .send<GetAccountResponse>();

        if (!relation) {
            return null;
        }

        const {
            id,
            businessNumber,
            vatNumber,
            addresses,
            names,
        } = relation;

        return {
            id,
            contactId: addresses.correspondence.contactId,
            firstName: addresses.correspondence.firstName,
            lastName: addresses.correspondence.lastName,
            email: addresses.correspondence.email,
            company: names.company,
            businessNumber,
            vatNumber,
        };
    }

    async function updateAccount(values: AccountModel) {
        const { success } = await apiService.request(endpoints.updateAccount)
            .send<ApiResponse>({ ...values });

        return success || false;
    }

    async function updatePassword(values: PasswordModel) {
        const { success } = await apiService.request(endpoints.updateAccount)
            .send<ApiResponse>({ ...values });

        return success || false;
    }

    return {
        getAccount,
        updateAccount,
        updatePassword,
    };
}
