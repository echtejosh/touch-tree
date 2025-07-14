import React, { ReactElement, useEffect, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Typography, Snackbar, Alert } from '@mui/material';
import { SubmitButton } from 'presentation/components';
import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';
import CreateCampaignIpAddressUseCase from 'application/usecases/campaigns/ipAddress/CreateCampaignIpAddressUseCase';
import { SliderElement, useWatch } from 'react-hook-form-mui';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import GetCampaignUseCase from 'application/usecases/campaigns/GetCampaignUseCase';

interface CreateCampaignIpAddressModalProps extends DialogOptions {
    campaignId: number;
}

export default function CreateCampaignIpAddressModal({
    campaignId,
    onClose,
}: CreateCampaignIpAddressModalProps): ReactElement {
    const createCampaignIpAddressUseCase = Container.resolve(CreateCampaignIpAddressUseCase);

    const {
        control,
        handleSubmit,
        setValues,
        getValues,
    } = useForm<CampaignIpAddressModel>({
        defaultValues: {
            range: 0,
            campaignId,
        },
    });

    const [rangeLimit, setRangeLimit] = useState(0);
    const [_ip, _setIp] = useState<string | null>(null);
    const [updatedAddress, setUpdatedAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { range = 0 } = useWatch({ control });

    async function onSubmit(values: CampaignIpAddressModel): Promise<boolean> {
        const result = await createCampaignIpAddressUseCase.handle(values);

        if (result && !result.success) {
            setError(result.serverStatus || 'An error occurred');
            return false;
        }

        useInvalidateQuery([GetCampaignUseCase.name, campaignId]);

        onClose();

        return result.success;
    }

    useEffect(() => {
        if (range > getValues()?.ip?.length) {
            setValues({
                range: getValues()?.ip?.length,
            });
        }

        setUpdatedAddress(_ip?.substring(range === 0 ? getValues().ip.length : range, 0) || null);
    }, [_ip, range]);

    return (
        <Box>
            {/* Error Snackbar */}
            {error && (
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    open={Boolean(error)}
                >
                    <Alert onClose={() => setError(null)} severity='error'>
                        {error}
                    </Alert>
                </Snackbar>
            )}
            <Typography p={4} variant='h2'>
                Create IP address
            </Typography>

            <Column mt={1} p={4} pt={0}>
                <Row fill>
                    <FormTextField
                        control={control}
                        fullWidth
                        label='Label'
                        name='label'
                    />
                </Row>

                <Row fill>
                    <FormTextField
                        control={control}
                        fullWidth
                        label='IP address'
                        name='ip'
                        onChange={(event) => {
                            _setIp(event.target.value);
                            setRangeLimit(event.target.value.length || 0);
                        }}
                        placeholder='255.255.255.255'
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Row>

                <Row justifyContent='space-between'>
                    <Box>Range</Box>
                    <Box>{updatedAddress}</Box>
                </Row>

                <Row sx={{ mx: 1 }}>
                    <SliderElement
                        control={control}
                        marks={[
                            {
                                value: rangeLimit,
                                label: rangeLimit,
                            },
                            {
                                value: range || 0,
                                label: range || 0,
                            },
                            {
                                value: 0,
                                label: 0,
                            },
                        ]}
                        max={_ip?.length || 0}
                        min={0}
                        name='range'
                        size='small'
                        track='inverted'
                        valueLabelDisplay='off'
                    />
                </Row>
            </Column>

            <Row end gap={2} m={4} mt={0}>
                <SubmitButton
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                >
                    Create
                </SubmitButton>
            </Row>
        </Box>
    );
}
