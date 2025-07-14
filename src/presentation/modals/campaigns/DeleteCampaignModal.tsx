import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { CampaignModel } from 'domain/models/CampaignModel';
import RemoveCampaignUseCase from 'application/usecases/campaigns/RemoveCampaignUseCase';
import GetCampaignsUseCase from 'application/usecases/campaigns/GetCampaignsUseCase';

interface DeleteCampaignModalProps extends DialogOptions {
    campaign: CampaignModel;
}

export default function DeleteCampaignModal({
    campaign,
    onClose,
}: DeleteCampaignModalProps) {
    const removeCampaignUseCase = Container.resolve(RemoveCampaignUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit() {
        const result = await removeCampaignUseCase.handle(campaign.id);

        if (result) {
            onClose();
            useInvalidateQuery([GetCampaignsUseCase.name]);
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
                {`Archive ${campaign.name} campaign?`}
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to archive this campaign?
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
                    Archive
                </SubmitButton>
            </Row>
        </Box>
    );
}
