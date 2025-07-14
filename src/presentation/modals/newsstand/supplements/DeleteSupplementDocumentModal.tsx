import React, { useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Alert, Button, Typography } from '@mui/material';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { DocumentModel } from 'domain/models/newsstand/NewsstandSupplementModel';
import RemoveSupplementDocumentUseCase from 'application/usecases/supplements/RemoveSupplementDocumentUseCase';
import { themePalette } from 'presentation/theme';

interface SupplementEditDocumentModalProps extends DialogOptions {
    document: DocumentModel;
}

export default function DeleteSupplementDocumentModal({
    document,
    onClose,
}: SupplementEditDocumentModalProps) {
    const removeSupplementDocumentUseCase = Container.resolve(RemoveSupplementDocumentUseCase);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit(): Promise<boolean> {
        const result = await removeSupplementDocumentUseCase.handle(document.id);

        if (result.success) {
            onClose();
            useInvalidateQuery([GetSupplementsUseCase.name]);
        } else {
            setErrorMessage(result.serverStatus || 'An unknown error occurred.');
        }

        return result.success;
    }

    return (
        <Box m={4}>
            <Typography
                sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    gap: 0.5,
                }}
            >
                {`Delete ${document.name} document?`}
            </Typography>

            <Column mb={4}>
                {errorMessage && (
                    <Alert severity='error' sx={{ border: 'none' }}>
                        {errorMessage}
                    </Alert>
                )}

                <Typography variant='subtitle1'>
                    Are you sure you want to delete this document? This action cannot be undone.
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
