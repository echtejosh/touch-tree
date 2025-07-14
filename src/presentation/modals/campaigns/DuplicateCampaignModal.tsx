import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import GetCampaignsUseCase from 'application/usecases/campaigns/GetCampaignsUseCase';
import { CampaignModel } from 'domain/models/CampaignModel';
import Container from 'infrastructure/services/Container';
import DuplicateCampaignUseCase from 'application/usecases/campaigns/DuplicateCampaignUseCase';

interface DuplicateCampaignModalProps extends DialogOptions {
    campaign: CampaignModel;
}

export default function DuplicateCampaignModal({
    campaign,
    onClose,
}: DuplicateCampaignModalProps) {
    const duplicateCampaignUseCase = Container.resolve(DuplicateCampaignUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit(): Promise<boolean> {
        const result = await duplicateCampaignUseCase.handle(campaign.id);

        if (result) {
            useInvalidateQuery([GetCampaignsUseCase.name]);
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
                {`Duplicate ${campaign.name} campaign?`}
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to duplicate this campaign?
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
                    variant='contained'
                >
                    Duplicate
                </SubmitButton>
            </Row>
        </Box>
    );
}
