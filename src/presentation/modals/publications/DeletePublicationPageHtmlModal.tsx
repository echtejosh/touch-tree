import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import UpdatePublicationPageUseCase from 'application/usecases/publications/UpdatePublicationPageUseCase';
import { NewsstandPublicationPageModel } from 'domain/models/newsstand/NewsstandPublicationModel';
import { themePalette } from 'presentation/theme';

interface DeletePublicationPageHtmlModalProps extends DialogOptions {
    publicationPageHtml: Partial<NewsstandPublicationPageModel>
    onChange: () => void
}

export default function DeletePublicationPageHtmlModal({
    publicationPageHtml,
    onChange,
    onClose,
}: DeletePublicationPageHtmlModalProps) {
    const updatePublicationPageUseCase = Container.resolve(UpdatePublicationPageUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit() {
        const result = await updatePublicationPageUseCase.handle({ ...publicationPageHtml, html: null });

        if (result) {
            onChange();
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
                {`Delete page ${publicationPageHtml.page}?`}
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to delete the content of this page?
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
