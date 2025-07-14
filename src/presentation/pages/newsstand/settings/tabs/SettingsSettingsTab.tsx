import React, { ReactElement, useEffect } from 'react';
import Container from 'infrastructure/services/Container';
import GetNewsstandSettingsUseCase from 'application/usecases/newsstand/settings/GetNewsstandSettingsUseCase';
import GetNewsstandDocumentSettingsUseCase
    from 'application/usecases/newsstand/settings/GetNewsstandDocumentSettingsUseCase';
import UpdateNewsstandSettingsUseCase from 'application/usecases/newsstand/settings/UpdateNewsstandSettingsUseCase';
import UpdateDocumentSettingsUseCase from 'application/usecases/newsstand/settings/UpdateDocumentSettingsUseCase';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { DocumentSettingsModel, SettingsModel } from 'domain/models/newsstand/NewsstandSettingsModel';
import { Column, Row } from 'presentation/components/layout';
import { CheckboxElement, Controller } from 'react-hook-form-mui';
import TextEditor from 'presentation/components/editor/TextEditor/TextEditor';
import { SubmitButton } from 'presentation/components';
import FormLabel from 'presentation/components/form/FormLabel';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import url from 'utils/url';

export default function SettingsSettingsTab(): ReactElement {
    const getNewsstandSettingsUseCase = Container.resolve(GetNewsstandSettingsUseCase);
    const getNewsstandDocumentSettingsUseCase = Container.resolve(GetNewsstandDocumentSettingsUseCase);
    const updateNewsstandSettingsUseCase = Container.resolve(UpdateNewsstandSettingsUseCase);
    const updateDocumentSettingsUseCase = Container.resolve(UpdateDocumentSettingsUseCase);

    const { formatMessage } = useIntl();

    const { data: settings } = useQuery(getNewsstandSettingsUseCase.handle, [GetNewsstandSettingsUseCase.name]);
    const { data: documentSettings } = useQuery(
        getNewsstandDocumentSettingsUseCase.handle,
        [GetNewsstandDocumentSettingsUseCase.name],
    );

    const {
        reset,
        control,
        handleSubmit,
    } = useForm<SettingsModel>({ defaultValues: { ...settings } });

    const {
        reset: resetDocuments,
        control: controlDocuments,
        getValues,
    } = useForm<DocumentSettingsModel>({ defaultValues: { ...documentSettings } });

    async function onSubmit(values: SettingsModel): Promise<boolean> {
        const documentValues = getValues();

        const [settingsResult, documentResult] = await Promise.all([
            updateNewsstandSettingsUseCase.handle(values),
            updateDocumentSettingsUseCase.handle(documentValues),
        ]);

        if (settingsResult && documentResult) {
            // useInvalidateQuery([GetEmailAccessFilesUseCase.name]);
            useInvalidateQuery([GetNewsstandSettingsUseCase.name]);
            useInvalidateQuery([GetNewsstandDocumentSettingsUseCase.name]);
        }

        return settingsResult && documentResult;
    }

    useEffect(() => {
        if (settings) {
            reset({ ...settings });
        }
        if (documentSettings) {
            resetDocuments({ ...documentSettings });
        }
    }, [settings, documentSettings]);

    return (
        <Column
            sx={{
                gap: 3,
            }}
        >
            <Column columns={3}>
                <FormLabel id='newsstand.settings.form.general-settings' />

                <Column gap={0}>
                    <FormTextField
                        control={control}
                        label='Domain name'
                        name='companyDomain'
                        readonly
                        required={false}
                        sx={{ mb: 1 }}
                    />

                    <CheckboxElement
                        control={control}
                        label={formatMessage({
                            defaultMessage: 'Offline content',
                            id: 'newsstand.settings.form.disable-speech',
                        })}
                        name='hasOfflineMode'
                    />

                    {/* <CheckboxElement */}
                    {/*     control={control} */}
                    {/*     label={formatMessage({ */}
                    {/*         defaultMessage: 'Disable text to speech', */}
                    {/*         id: 'newsstand.settings.form.disable-speech', */}
                    {/*     })} */}
                    {/*     name='isSpeechDisabled' */}
                    {/*     onChange={(event) => { */}
                    {/*         setInteraction({ */}
                    {/*             name: 'isSpeechDisabled', */}
                    {/*             value: event.target.checked, */}
                    {/*         }); */}
                    {/*     }} */}
                    {/* /> */}

                    <CheckboxElement
                        control={controlDocuments}
                        label={formatMessage({
                            defaultMessage: 'Downloadable Supplements',
                            id: 'newsstand.settings.form.disable-speech',
                        })}
                        name='enableDocumentDownload'
                    />
                </Column>
            </Column>

            <Column columns={3}>
                <FormLabel id='newsstand.settings.privacy-policy' />

                <Column gap={0} gridColumn='span 2'>
                    <Controller
                        control={control}
                        name='privacyPolicyText'
                        render={({ field }) => (
                            <TextEditor
                                onChange={field.onChange}
                                value={field.value}
                            />
                        )}
                    />
                </Column>
            </Column>

            <Column columns={3}>
                <FormLabel id='newsstand.settings.welcome-message' />

                <Column gap={0} gridColumn='span 2'>
                    <Controller
                        control={control}
                        name='platformWelcomeMessage'
                        render={({ field }) => (
                            <TextEditor
                                onChange={field.onChange}
                                value={field.value}
                            />
                        )}
                    />
                </Column>
            </Column>

            <Column columns={3}>
                <FormLabel id='newsstand.settings.registration-welcome-text' />

                <Column gap={0} gridColumn='span 2'>
                    <Controller
                        control={control}
                        name='registrationWelcomeText'
                        render={({ field }) => (
                            <TextEditor
                                onChange={field.onChange}
                                value={field.value}
                            />
                        )}
                    />
                </Column>
            </Column>

            <Column columns={3}>
                <FormLabel id='newsstand.settings.message-upon-invalid-login' />

                <Column gap={0} gridColumn='span 2'>
                    <Controller
                        control={control}
                        name='accessRejectionText'
                        render={({ field }) => (
                            <TextEditor
                                onChange={field.onChange}
                                value={field.value}
                            />
                        )}
                    />
                </Column>
            </Column>

            <Column columns={3}>
                <FormLabel id='newsstand.settings.redirect-url-after-invalid-login' />

                <Column gap={0} gridColumn='span 1'>
                    <FormTextField
                        control={control}
                        fullWidth
                        label='URL'
                        name='accessRejectionRedirectUrl'
                        placeholder='example.com'
                        required={false}
                        rules={{
                            validate: (value) => {
                                if (!value) return true;
                                return url.isValid(value as string) ? true : 'Invalid URL format';
                            },
                        }}
                        type='url'
                    />
                </Column>
            </Column>

            <Row sx={{ justifyContent: 'end' }}>
                <SubmitButton
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    size='large'
                >
                    <FormattedMessage
                        defaultMessage='Save changes'
                        id='button.save'
                    />
                </SubmitButton>
            </Row>
        </Column>
    );
}
