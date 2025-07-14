import React, { useEffect } from 'react';
import Container from 'infrastructure/services/Container';
import { GetAccountUseCase } from 'application/usecases/account/GetAccountPasswordUseCase';
import { useForm, useIntl, useQuery } from 'presentation/hooks';
import { AccountModel } from 'domain/models/auth/AccountModel';
import { SubmitButton } from 'presentation/components';
import { UpdateAccountUseCase } from 'application/usecases/account/UpdateAccountUseCase';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import { Typography } from '@mui/material';

export default function SettingsAccountTab() {
    const getAccountUseCase = Container.resolve(GetAccountUseCase);
    const updateAccountUseCase = Container.resolve(UpdateAccountUseCase);

    const { formatMessage } = useIntl();
    const { data: account } = useQuery(getAccountUseCase.handle, [GetAccountUseCase.name]);

    const {
        reset,
        control,
        handleSubmit,
    } = useForm<AccountModel>({ defaultValues: { ...account } });

    useEffect(() => {
        if (account) {
            reset(account);
        }
    }, [account]);

    return (
        <Column>
            <Column>
                <Typography fontWeight={600}>
                    <FormattedMessage id='settings.account.correspondence' />
                </Typography>

                <Row
                    direction={{
                        xs: 'column',
                        sm: 'row',
                    }}
                >
                    <FormTextField
                        control={control}
                        label={formatMessage({ id: 'settings.account.first-name' })}
                        name='firstName'
                        required={false}
                    />

                    <FormTextField
                        control={control}
                        label={formatMessage({ id: 'settings.account.last-name' })}
                        name='lastName'
                        required={false}
                    />
                </Row>

                <FormTextField
                    control={control}
                    label={formatMessage({ id: 'label.email' })}
                    name='email'
                    required
                    type='email'
                />
            </Column>

            <Column>
                <Typography fontWeight={600}>
                    <FormattedMessage id='settings.account.client' />
                </Typography>

                <FormTextField
                    control={control}
                    label={formatMessage({ id: 'settings.account.client-number' })}
                    name='id'
                    readonly
                />

                <FormTextField
                    control={control}
                    label={formatMessage({ id: 'settings.account.company' })}
                    name='company'
                    required
                />

                <Row
                    direction={{
                        xs: 'column',
                        sm: 'row',
                    }}
                >
                    <FormTextField
                        control={control}
                        label={formatMessage({ id: 'settings.account.business-number' })}
                        name='businessNumber'
                        required={false}
                    />

                    <FormTextField
                        control={control}
                        label={formatMessage({ id: 'settings.account.vat-number' })}
                        name='vatNumber'
                        required={false}
                    />
                </Row>
            </Column>

            <Row end gap={2}>
                <SubmitButton
                    handleSubmit={handleSubmit}
                    onSubmit={updateAccountUseCase.handle}
                >
                    <FormattedMessage id='button.save' />
                </SubmitButton>
            </Row>
        </Column>
    );
}
