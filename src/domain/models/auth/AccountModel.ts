export interface AccountModel {
    id: number;
    contactId: number | undefined;
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    businessNumber: string;
    vatNumber: string;
}
