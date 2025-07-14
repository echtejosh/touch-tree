import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { themePalette } from 'presentation/theme';
import DeletePublicationInteractionUseCase from 'application/usecases/publications/DeletePublicationInteractionUseCase';
import GetPublicationInteractionsUseCase from 'application/usecases/publications/GetPublicationInteractionsUseCase';

interface DeletePublicationInteractionModalProps extends DialogOptions {
    id: number;
}

export default function DeletePublicationInteractionModal({
    id,
    onClose,
}: DeletePublicationInteractionModalProps) {
    const removePublicationInteractionUseCase = Container.resolve(DeletePublicationInteractionUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit() {
        const result = await removePublicationInteractionUseCase.handle(id);

        if (result) {
            useInvalidateQuery([GetPublicationInteractionsUseCase.name]);
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
                Delete interaction?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to delete this interaction? This action cannot be undone.
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
