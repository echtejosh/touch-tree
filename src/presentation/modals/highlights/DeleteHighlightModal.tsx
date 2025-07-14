import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { themePalette } from 'presentation/theme';
import RemoveHighlightUseCase from 'application/usecases/highlights/RemoveHighlightUseCase';
import GetHighlightsUseCase from 'application/usecases/highlights/GetHighlightsUseCase';
import { HighlightModel } from 'domain/models/HighlightModel';

interface HighlightDeleteModalProps extends DialogOptions {
    highlight: HighlightModel;
}

export default function DeleteHighlightModal({
    highlight,
    onClose,
}: HighlightDeleteModalProps) {
    const removeHighlightUseCase = Container.resolve(RemoveHighlightUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit() {
        const result = await removeHighlightUseCase.handle(highlight.id);

        if (result) {
            onClose();
            useInvalidateQuery([GetHighlightsUseCase.name]);
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
                {`Delete ${highlight.title} highlight?`}
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to delete this highlight? This action cannot be undone.
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
