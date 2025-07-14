import React, { ReactElement } from 'react';
import { useForm, useIntl } from 'presentation/hooks';
import { Column, Row } from 'presentation/components/layout';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@mui/material';
import { InputField, Link, SubmitButton } from 'presentation/components';
import { ResetPasswordUseCase, ResetPasswordUseCaseProps } from 'application/usecases/auth/ResetPasswordUseCase';
import Container from 'infrastructure/services/Container';

export default function ForgotPasswordPage(): ReactElement {
    const resetPasswordUseCase = Container.resolve(ResetPasswordUseCase);
    const { formatMessage } = useIntl();

    const {
        control,
        handleSubmit,
    } = useForm<ResetPasswordUseCaseProps>();

    return (
        <form noValidate>
            <Row container justifyContent='center'>
                <Column
                    gap={3}
                    width={600}
                >
                    <Typography variant='h1'>
                        <FormattedMessage id='forgot-password.header' />
                    </Typography>

                    <Typography mb={3} variant='body1'>
                        <FormattedMessage id='forgot-password.subtitle' />
                    </Typography>

                    <InputField
                        control={control}
                        label={formatMessage({ id: 'label.database' })}
                        name='database'
                        required
                        type='text'
                    />

                    <InputField
                        control={control}
                        label={formatMessage({ id: 'label.email' })}
                        name='email'
                        required
                        type='email'
                    />

                    <SubmitButton
                        handleSubmit={handleSubmit}
                        onSubmit={async (values): Promise<boolean> => {
                            await resetPasswordUseCase.handle(values);

                            /**
                             * Returns `true` to keep users uninformed about the validity of the
                             * reset password response.
                             */
                            return true;
                        }}
                    >
                        <FormattedMessage id='label.reset-password' />
                    </SubmitButton>

                    <Link sx={{ mt: 1 }} to='/login'>
                        <FormattedMessage id='forgot-password.back-button' />
                    </Link>
                </Column>
            </Row>
        </form>
    );
}
