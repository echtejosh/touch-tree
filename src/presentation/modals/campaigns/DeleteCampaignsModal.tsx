import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import RemoveCampaignUseCase from 'application/usecases/campaigns/RemoveCampaignUseCase';
import GetCampaignsUseCase from 'application/usecases/campaigns/GetCampaignsUseCase';

interface DeleteCampaignsModalProps extends DialogOptions {
    ids: number[];
}

export default function DeleteCampaignsModal({
    ids,
    onClose,
}: DeleteCampaignsModalProps) {
    const removeCampaignUseCase = Container.resolve(RemoveCampaignUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit(): Promise<boolean> {
        const deletionPromises = ids.map((id) => removeCampaignUseCase.handle(id));

        const results = await Promise.allSettled(deletionPromises);

        const allSucceeded = results.every((result) => result.status === 'fulfilled');

        if (allSucceeded) {
            useInvalidateQuery([GetCampaignsUseCase.name]);
            onClose();
        }

        return allSucceeded;
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
                Archive selected campaign(s)?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to archive selected campaign(s)?
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
