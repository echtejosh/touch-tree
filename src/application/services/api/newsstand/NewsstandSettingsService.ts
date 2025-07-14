import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import endpoints from 'infrastructure/routes/endpoints';
import {
    DocumentSettingsModel,
    EmailAccessFileModel,
    RegistrationsModel,
    SettingsModel,
} from 'domain/models/newsstand/NewsstandSettingsModel';
import date from 'utils/date';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import { ApiResponse } from 'infrastructure/services/types';

interface GetNewsstandSettingsResponse {
    digiDepartment: {
        accessRejectionRedirectUrl: string | null;
        accessRejectionText: string | null;
        hasMaleVoice: boolean;
        switchId: number | null;
        geoId: number | null;
        hasRealtimeBlockSpeechApi: boolean;
        hasMainpageImageCaption: boolean;
        hasSearchpageCategoryListing: boolean;
        quantityEmailAccess: number;
        hasEmailRegistrationDirectToken: boolean;
        hasRegistrationDirectToken: boolean;
        hasEmailRegistration: boolean;
        hasEmailAccessDirectToken: boolean;
        hasEmailAccess: boolean;
        id: number;
        label: string;
        countryId: number;
        createdBy: number | null;
        modifiedBy: number | null;
        dateCreated: number | null;
        dateModified: number | null;
        isArchived: boolean;
        relationId: number;
        delimiterId: number | null;
        relationData: RelationData;
        delimiterData: DelimiterData;
        privacyPolicyContent: string;
        registrationWelcomeText: string;
        emailAccessUploadLog: EmailAccessUploadLog[];
        hasOfflineMode: boolean;
        platformWelcomeMessage: string | null;
    }
}

interface RelationData {
    id: number;
    fullCompanyName: string;
    company: string;
    rootName: string;
    branchName: string;
    relationName: string;
    domainName: string;
    hasSpeechBlock: boolean;
    hasAdvert: boolean;
}

interface DelimiterData {
    id: number | null;
    label: string | null;
    ascii: string | null;
}

interface GetDigiCustomizationResponse {
    digiPlatformCustomisation: {
        relationDetails: {
            hasDocumentDownloadOption: boolean;
            hasDocumentViewAsDefault: boolean;
        }
    }
}

interface EmailAccessUploadLog {
    id: number;
    departmentId: number;
    fileName: string;
    quantity: number;
    createdBy: number;
    dateCreated: number;
}

interface UpdateNewsstandSettingsPayload {
    accessRejectionText: string | null;
    accessRejectionRedirectUrl: string | null;
    hasSpeechBlock: boolean,
    privacyPolicyContent: string,
    registrationWelcomeText: string,
    hasOfflineMode: boolean;
    platformWelcomeMessage: string | null;
}

interface UpdateDocumentSettingsPayload {
    hasDocumentDownloadOption: boolean,
    hasDocumentViewAsDefault: boolean,
}

interface UpdateNewsstandRegistrationsPayload {
    hasEmailRegistration: boolean,
    hasRegistrationDirectToken: boolean,
}

interface GetFileResponse {
    response: Response;
}

export interface UploadFilePayload {
    fileName: string;
    fileData: string;
}

export default function NewsstandSettingsService() {
    const apiService = Container.resolve(ApiService);

    async function getSettings(): Promise<Partial<SettingsModel> | null> {
        const { digiDepartment } = await apiService.request(endpoints.getNewsstandSettings)
            .send<GetNewsstandSettingsResponse>();

        if (!digiDepartment) {
            return null;
        }

        const {
            accessRejectionText,
            accessRejectionRedirectUrl,
            relationData,
            privacyPolicyContent,
            registrationWelcomeText,
            hasOfflineMode,
            platformWelcomeMessage,
        } = digiDepartment;

        return {
            accessRejectionText,
            accessRejectionRedirectUrl,
            companyDomain: relationData?.domainName,
            isSpeechDisabled: relationData?.hasSpeechBlock,
            privacyPolicyText: privacyPolicyContent || String(),
            registrationWelcomeText: registrationWelcomeText || String(),
            hasOfflineMode,
            platformWelcomeMessage,
        };
    }

    async function updateSettings(values: Partial<SettingsModel>): Promise<boolean> {
        const payload: Partial<UpdateNewsstandSettingsPayload> = {
            accessRejectionText: values.accessRejectionText,
            accessRejectionRedirectUrl: values.accessRejectionRedirectUrl,
            hasSpeechBlock: values.isSpeechDisabled,
            privacyPolicyContent: values.privacyPolicyText,
            registrationWelcomeText: values.registrationWelcomeText,
            hasOfflineMode: values.hasOfflineMode,
            platformWelcomeMessage: values.platformWelcomeMessage,
        };

        const { success } = await apiService.request(endpoints.updateNewsstandSettings)
            .send<ApiResponse>({ ...payload });

        return success || false;
    }

    async function getDocumentSettings(): Promise<Partial<DocumentSettingsModel> | null> {
        const { digiPlatformCustomisation } = await apiService.request(endpoints.getNewsstandCustom)
            .send<GetDigiCustomizationResponse>();

        if (!digiPlatformCustomisation) {
            return null;
        }

        return {
            defaultToDocumentView: digiPlatformCustomisation.relationDetails.hasDocumentViewAsDefault,
            enableDocumentDownload: digiPlatformCustomisation.relationDetails.hasDocumentDownloadOption,
        };
    }

    async function updateDocumentSettings(values: Partial<DocumentSettingsModel>): Promise<boolean> {
        const payload: Partial<UpdateDocumentSettingsPayload> = {
            hasDocumentDownloadOption: values.enableDocumentDownload,
            hasDocumentViewAsDefault: values.defaultToDocumentView,
        };

        const { success } = await apiService.request(endpoints.updateNewsstandCustom)
            .send<ApiResponse>({ ...payload });

        return success || false;
    }

    async function getEmailAccessFile(): Promise<FileShape | null> {
        const { response } = await apiService.request(endpoints.downloadEmailsAccessData)
            .send<GetFileResponse>();

        if (!response) {
            return null;
        }

        return { name: 'email-access-data', content: response.url };
    }

    async function getEmailAccessFiles(): Promise<EmailAccessFileModel[] | null> {
        const { digiDepartment } = await apiService.request(endpoints.getNewsstandSettings)
            .send<GetNewsstandSettingsResponse>();

        if (!digiDepartment) {
            return null;
        }

        const processEmailAccessFiles = (file: EmailAccessUploadLog): EmailAccessFileModel => ({
            id: file.id,
            date: date.unix(file.dateCreated),
            fileName: file.fileName || null,
            recordCount: file.quantity || 0,
        });

        return digiDepartment.emailAccessUploadLog?.map(processEmailAccessFiles);
    }

    async function getRegistrations(): Promise<RegistrationsModel | null> {
        const { digiDepartment } = await apiService.request(endpoints.getNewsstandSettings)
            .send<GetNewsstandSettingsResponse>();

        if (!digiDepartment) {
            return null;
        }

        const {
            hasEmailRegistration,
            hasRegistrationDirectToken,
        } = digiDepartment;

        return {
            allowsEmailRegistration: hasEmailRegistration,
            allowsImmediateAccess: hasRegistrationDirectToken,
        };
    }

    async function updateRegistrations(values: Partial<RegistrationsModel>): Promise<boolean> {
        const payload: Partial<UpdateNewsstandRegistrationsPayload> = {
            hasEmailRegistration: values.allowsEmailRegistration,
            hasRegistrationDirectToken: values.allowsImmediateAccess,
        };

        const { success } = await apiService.request(endpoints.updateNewsstandSettings)
            .send<ApiResponse>({ ...payload });

        return success || false;
    }

    async function getRegistrantsFile(): Promise<FileShape | null> {
        const { response } = await apiService.request(endpoints.downloadDepartmentRegistrants)
            .send<GetFileResponse>();

        if (!response) {
            return null;
        }

        return { name: 'registrations-data', content: response.url };
    }

    async function uploadEmailsAccessFile(values: FileShape): Promise<boolean> {
        const payload: UploadFilePayload = {
            fileName: values.name,
            fileData: values.content,
        };

        const { success } = await apiService.request(endpoints.uploadEmailsAccessData)
            .send<ApiResponse>({ ...payload });

        return success || false;
    }

    return {
        getSettings,
        updateSettings,
        getDocumentSettings,
        updateDocumentSettings,
        getEmailAccessFile,
        getEmailAccessFiles,
        getRegistrations,
        updateRegistrations,
        getRegistrantsFile,
        uploadEmailsAccessFile,
    };
}
