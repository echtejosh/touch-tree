import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { themePalette } from 'presentation/theme';
import UpdateEditorAdditionalPodsUseCase from 'application/usecases/newsstand/editor/UpdateEditorAdditionalPodsUseCase';
import GetEditorAdditionalPodsUseCase from 'application/usecases/newsstand/editor/GetEditorAdditionalPodsUseCase';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';

interface DeleteAdditionalPodsModalProps extends DialogOptions {
    setAdditionalPods: (pods: EditorPodModel[]) => void;
}

export default function DeleteAdditionalPodsModal({
    onClose,
    setAdditionalPods,
}: DeleteAdditionalPodsModalProps) {
    const updateEditorAdditionalPodsUseCase = Container.resolve(UpdateEditorAdditionalPodsUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit() {
        const result = await updateEditorAdditionalPodsUseCase.handle(null);

        if (result) {
            setAdditionalPods([]);
            useInvalidateQuery([GetEditorAdditionalPodsUseCase.name]);
            useInvalidateQuery([GetMetricsUseCase.name]);

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
                Delete rectangles?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    You are about to remove the 2 rectangles from the platform.
                    This action cannot be undone and will reset all content linked to these rectangles.
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
