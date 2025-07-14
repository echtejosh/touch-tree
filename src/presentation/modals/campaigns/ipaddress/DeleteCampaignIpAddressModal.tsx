import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { themePalette } from 'presentation/theme';
import RemoveCampaignIpAddressUseCase from 'application/usecases/campaigns/ipAddress/RemoveCampaignIpAddressUseCase';
import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';
import GetCampaignUseCase from 'application/usecases/campaigns/GetCampaignUseCase';

interface DeleteCampaignIpAddressModalProps extends DialogOptions {
    ipAddress: CampaignIpAddressModel;
}

export default function DeleteCampaignIpAddressModal({
    ipAddress,
    onClose,
}: DeleteCampaignIpAddressModalProps) {
    const removeCampaignIpAddressUseCase = Container.resolve(RemoveCampaignIpAddressUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit() {
        const result = await removeCampaignIpAddressUseCase.handle(ipAddress.id);

        if (result) {
            useInvalidateQuery([GetCampaignUseCase.name, ipAddress.campaignId]);
            onClose();
        }

        return result;
    }

    return (
        <Box m={4}>
            <Typography
                sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    mb: 3,
                }}
            >
                {`Delete ${ipAddress.label} IP address?`}
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to delete this IP address? This action cannot be undone.
                </Typography>
            </Column>

            <Row justifyContent='space-between'>
                <Button
                    color='primary'
                    onClick={onClose}
                    size='large'
                    variant='outlined'
                >
                    Cancel
                </Button>

                <SubmitButton
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    size='large'
                    sx={{
                        background: themePalette.error.main,
                        ':hover': {
                            background: themePalette.error.light,
                        },
                    }}
                    variant='contained'
                >
                    Delete
                </SubmitButton>
            </Row>
        </Box>
    );
}
