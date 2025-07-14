import React, { ReactElement, useState } from 'react';
import { useForm, useIntl, useAuth } from 'presentation/hooks';
import { Box, Column, Row } from 'presentation/components/layout';
import { FormattedMessage } from 'react-intl';
import { CheckboxElement } from 'react-hook-form-mui';
import { Alert, Typography } from '@mui/material';
import { InputField, Link, PasswordField, SubmitButton } from 'presentation/components';
import { Navigate, useLocation } from 'react-router-dom';
import { LoginUseCaseProps } from 'application/usecases/auth/LoginUseCase';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import { getCurrentTheme } from 'presentation/themes/themeSelect';
import { useTokenFromUrl } from 'presentation/hooks/useTokenFromUrl';

export default function LoginPage(): ReactElement {
    const location = useLocation();
    const theme = getCurrentTheme();
    const { formatMessage } = useIntl();

    const {
        loggedIn,
        login,
    } = useAuth();

    const {
        control,
        handleSubmit,
    } = useForm<LoginUseCaseProps>({
        defaultValues: {
            database: theme.database || (theme.subset ? 'dltuk' : undefined),
        },
    });

    const [relationIdRequired, setRelationIdRequired] = useState<boolean>(false);

    useTokenFromUrl();

    if (loggedIn) {
        return <Navigate to={location.state?.from || (!theme.subset ? '/dashboard' : '/newsstand/editor')} />;
    }

    async function onSubmit(values: LoginUseCaseProps): Promise<boolean> {
        const response = await login(values);

        if (response === null) {
            return false;
        }

        const {
            token,
            requiresRelationId,
        } = response;

        if (token) return true;

        if (requiresRelationId) {
            setRelationIdRequired(requiresRelationId);
            return true;
        }

        return false;
    }

    return (
        <Box
            component='form'
            noValidate
        >
            <Row container justifyContent='center'>
                <Column gap={3} width={600}>
                    <Typography variant='h1'>
                        <FormattedMessage id='login.header' />
                    </Typography>

                    <Typography mb={3} variant='body1'>
                        <FormattedMessage id='login.subtitle' />
                    </Typography>

                    {!theme.subset && (
                        <InputField
                            control={control}
                            helperText='Provide a database corresponding to your company'
                            label={formatMessage({ id: 'label.database' })}
                            name='database'
                            required
                            type='text'
                        />
                    )}

                    <InputField
                        control={control}
                        label={formatMessage({ id: 'label.email' })}
                        name='email'
                        required
                        type='email'
                    />

                    <PasswordField
                        control={control}
                        label={formatMessage({ id: 'label.password' })}
                        name='password'
                    />

                    {(relationIdRequired) && (
                        <Column>
                            <Alert
                                severity='info'
                                sx={{ border: 'none' }}
                            >
                                You have to provide a relation ID in order to access a platform
                            </Alert>

                            <FormTextField
                                control={control}
                                label='Relation id'
                                name='relationId'
                                required
                                rules={{
                                    min: {
                                        value: 1,
                                        message: 'The minimum value is 1',
                                    },
                                    validate: (value) => Number.isInteger(Number(value)) || 'The value must be a whole number',
                                }}
                                type='number'
                            />
                        </Column>
                    )}

                    <Row alignItems='center' justifyContent='space-between'>
                        <CheckboxElement
                            control={control}
                            label={formatMessage({ id: 'label.login.remember-me' })}
                            name='rememberMe'
                        />

                        <Link to='/forgot-password'>
                            <FormattedMessage id='login.forgot-password' />
                        </Link>
                    </Row>

                    <SubmitButton handleSubmit={handleSubmit} onSubmit={onSubmit}>
                        <FormattedMessage id='label.login' />
                    </SubmitButton>
                </Column>
            </Row>
        </Box>
    );
}
