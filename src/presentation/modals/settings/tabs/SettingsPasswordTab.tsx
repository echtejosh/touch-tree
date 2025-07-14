import { useForm, useIntl } from 'presentation/hooks';
import Container from 'infrastructure/services/Container';
import { UpdatePasswordUseCase, UpdatePasswordUseCaseProps } from 'application/usecases/account/UpdatePasswordUseCase';
import { Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import React from 'react';
import { Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { SubmitButton } from 'presentation/components';

export default function SettingsPasswordTab() {
    const updatePasswordUseCase = Container.resolve(UpdatePasswordUseCase);

    const { formatMessage } = useIntl();
    const {
        handleSubmit,
        control,
    } = useForm<UpdatePasswordUseCaseProps>();

    return (
        <Column>
            <Typography fontWeight={600}>
                <FormattedMessage id='settings.password.title' />
            </Typography>

            <FormTextField
                control={control}
                label={formatMessage({ id: 'settings.password.current-password' })}
                name='oldPassword'
                required
            />

            <FormTextField
                control={control}
                helperText='Min. length 8 characters, include at least 1 uppercase and special character'
                label={formatMessage({ id: 'settings.password.new-password' })}
                name='password'
                required
            />

            <FormTextField
                control={control}
                label={formatMessage({ id: 'settings.password.confirm-new-password' })}
                name='passwordConfirm'
                required
            />

            <Row end gap={2}>
                <SubmitButton
                    handleSubmit={handleSubmit}
                    onSubmit={updatePasswordUseCase.handle}
                >
                    <FormattedMessage id='button.save' />
                </SubmitButton>
            </Row>
        </Column>
    );
}
