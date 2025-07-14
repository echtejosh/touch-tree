import React, { ReactElement, useEffect, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Typography, Snackbar, Alert } from '@mui/material';
import { SubmitButton } from 'presentation/components';
import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';
import { SliderElement, useWatch } from 'react-hook-form-mui';
import UpdateCampaignIpAddressUseCase from 'application/usecases/campaigns/ipAddress/UpdateCampaignIpAddressUseCase';
import GetCampaignIpAddressUseCase from 'application/usecases/campaigns/ipAddress/GetCampaignIpAddressUseCase';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { DevTool } from '@hookform/devtools';
import GetCampaignUseCase from 'application/usecases/campaigns/GetCampaignUseCase';

interface UpdateCampaignIpAddressModalProps extends DialogOptions {
    id: number;
}

export default function UpdateCampaignIpAddressModal({
    id,
    onClose,
}: UpdateCampaignIpAddressModalProps): ReactElement {
    const updateCampaignIpAddressUseCase = Container.resolve(UpdateCampaignIpAddressUseCase);
    const getCampaignIpAddressUseCase = Container.resolve(GetCampaignIpAddressUseCase);

    const { data: ipAddress } = useQuery(() => getCampaignIpAddressUseCase.handle(id), [GetCampaignIpAddressUseCase.name, id]);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<CampaignIpAddressModel>({
        defaultValues: {
            ...ipAddress,
        },
    });

    const [rangeLimit, setRangeLimit] = useState(0);
    const [updatedAddress, setUpdatedAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { range = 0, ip = null, id: _id } = useWatch({ control });

    async function onSubmit(values: CampaignIpAddressModel): Promise<boolean> {
        const result = await updateCampaignIpAddressUseCase.handle(values);

        if (result && !result.success) {
            setError(result.serverStatus || 'An error occurred');
            return false;
        }

        useInvalidateQuery([GetCampaignUseCase.name, ipAddress?.campaignId]);

        onClose();

        return result.success;
    }

    useEffect(() => {
        setUpdatedAddress(ip?.substring(range === 0 ? ip.length : range, 0) || null);
    }, [ip, range]);

    useEffect(() => {
        if (ipAddress) {
            reset(ipAddress);
            setRangeLimit(ipAddress.ip.length || 0);
        }
    }, [ipAddress]);

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
            <DevTool control={control} />
            <Typography p={4} variant='h2'>
                {`Edit ${ipAddress?.label}`}
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
                        key={_id}
                        control={control}
                        marks={[
                            {
                                value: rangeLimit,
                                label: rangeLimit,
                            },
                            {
                                value: range,
                                label: range,
                            },
                            {
                                value: 0,
                                label: 0,
                            },
                        ]}
                        max={rangeLimit}
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
                    Save changes
                </SubmitButton>
            </Row>
        </Box>
    );
}
