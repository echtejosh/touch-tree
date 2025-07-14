import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import GetHighlightsUseCase from 'application/usecases/highlights/GetHighlightsUseCase';
import UpdateHighlightUseCase from 'application/usecases/highlights/UpdateHighlightUseCase';

interface HighlightsLockModalProps extends DialogOptions {
    ids: number[];
}

export default function LockHighlightsModal({
    ids,
    onClose,
}: HighlightsLockModalProps) {
    const updateHighlightUseCase = Container.resolve(UpdateHighlightUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit(): Promise<boolean> {
        const lockPromises = ids.map((id) => updateHighlightUseCase.handle({ id, isLocked: true }));

        const results = await Promise.allSettled(lockPromises);

        const allSucceeded = results.every((result) => result.status === 'fulfilled');

        if (allSucceeded) {
            useInvalidateQuery([GetHighlightsUseCase.name]);
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
                Lock selected highlight(s)?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to lock selected highlight(s)?
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
                    Lock
                </SubmitButton>
            </Row>
        </Box>
    );
}
