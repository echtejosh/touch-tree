import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CheckboxElement } from 'react-hook-form-mui';
import { Typography } from '@mui/material';
import { Box, Column, Row } from 'presentation/components/layout';
import { RegistrationsModel } from 'domain/models/newsstand/NewsstandSettingsModel';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import Container from 'infrastructure/services/Container';
import useInteraction from 'presentation/hooks/useInteraction';
import GetRegistrationsUseCase from 'application/usecases/newsstand/settings/GetRegistrationsUseCase';
import UpdateRegistrationsUseCase from 'application/usecases/newsstand/settings/UpdateRegistrationsUseCase';
import GetRegistrantsFileUseCase from 'application/usecases/newsstand/settings/GetRegistrantsFileUseCase';
import DownloadButton from 'presentation/components/buttons/DownloadButton';

export default function SettingsRegistrationsTab() {
    const getRegistrationsUseCase = Container.resolve(GetRegistrationsUseCase);
    const getRegistrantsFileUseCase = Container.resolve(GetRegistrantsFileUseCase);
    const updateRegistrationsUseCase = Container.resolve(UpdateRegistrationsUseCase);

    const { formatMessage } = useIntl();

    const { data: registrations } = useQuery(getRegistrationsUseCase.handle, [GetRegistrationsUseCase.name]);
    const { data: registrationsFile } = useQuery(
        getRegistrantsFileUseCase.handle,
        [GetRegistrantsFileUseCase.name],
    );

    const {
        control,
        reset,
    } = useForm<RegistrationsModel>({ defaultValues: { ...registrations } });

    const { setInteraction } = useInteraction(updateRegistrationsUseCase.handle, () => {
        useInvalidateQuery([GetRegistrationsUseCase.name]);
    });

    useEffect(() => {
        if (registrations) {
            reset(registrations);
        }
    }, [registrations]);

    return (
        <Column
            sx={{
                justifyContent: 'space-between',
                gap: 4,
            }}
        >
            <Row sx={{
                display: 'flex',
                gap: { xs: 4, sm: 2 },
                flexDirection: {
                    xs: 'column',
                    md: 'row',
                },
            }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography
                        sx={{ fontWeight: 600 }}
                        variant='subtitle1'
                    >
                        <FormattedMessage
                            defaultMessage='Registration'
                            id='newsstand.emailAccessFiles.upload-access-data'
                        />
                    </Typography>
                </Box>
                <Box
                    sx={{
                        flex: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 5, md: 3 },
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 4, sm: 3, md: 1, lg: 0 },
                    }}
                    >
                        <CheckboxElement
                            control={control}
                            label={formatMessage({
                                defaultMessage: 'Register using the registration form '
                                        + 'before viewing the newsstand',
                                id: 'newsstand.settings.form.allows-email-registration',
                            })}
                            name='allowsEmailRegistration'
                            onChange={(event) => {
                                setInteraction({ name: 'allowsEmailRegistration', value: event.target.checked });
                            }}
                        />
                        <CheckboxElement
                            control={control}
                            label={formatMessage({
                                defaultMessage: 'Allow users to register without verification email',
                                id: 'allows-immediate-access',
                            })}
                            name='allowsImmediateAccess'
                            onChange={(event) => {
                                setInteraction({ name: 'allowsImmediateAccess', value: event.target.checked });
                            }}
                        />
                    </Box>
                    <Box>
                        <DownloadButton
                            file={registrationsFile}
                            label='Export registrations as .xlsx'
                        />
                    </Box>
                </Box>
            </Row>
        </Column>
    );
}
