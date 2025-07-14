export interface SettingsModel {
    accessRejectionText: string | null;
    accessRejectionRedirectUrl: string | null;
    companyDomain?: string;
    isSpeechDisabled: boolean;
    privacyPolicyText: string;
    registrationWelcomeText: string;
    hasOfflineMode: boolean;
    platformWelcomeMessage: string | null;
}

export interface DocumentSettingsModel {
    enableDocumentDownload: boolean;
    defaultToDocumentView: boolean;
}

export interface EmailAccessFileModel {
    id: number;
    date: Date | null;
    fileName: string | null;
    recordCount: number;
}

export interface RegistrationsModel {
    allowsEmailRegistration: boolean;
    allowsImmediateAccess: boolean;
}
