import React from 'react';
import {
    Button, Typography,
} from '@mui/material';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import UpdateRelationAdvertUseCase from 'application/usecases/relation-adverts/UpdateRelationAdvertUseCase';
import GetRelationAdvertsUseCase from 'application/usecases/relation-adverts/GetRelationAdvertsUseCase';
import { Box, Column, Row } from 'presentation/components/layout';
import { SubmitButton } from 'presentation/components';

interface LockRelationAdvertsModalProps extends DialogOptions {
    ids: number[];
}

export default function LockRelationAdvertsModal({
    ids,
    onClose,
}: LockRelationAdvertsModalProps) {
    const updateRelationAdvertUseCase = Container.resolve(UpdateRelationAdvertUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit(): Promise<boolean> {
        const lockPromises = ids.map((id) => updateRelationAdvertUseCase.handle({
            id,
            isLocked: true,
        }));
        const results = await Promise.allSettled(lockPromises);

        const allSucceeded = results.every((result) => result.status === 'fulfilled');

        if (allSucceeded) {
            useInvalidateQuery([GetRelationAdvertsUseCase.name]);
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
                Lock selected advert(s)?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to lock selected advert(s)?
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
