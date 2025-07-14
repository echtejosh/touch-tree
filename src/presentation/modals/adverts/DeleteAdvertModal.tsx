import React, { ReactElement } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { themePalette } from 'presentation/theme';
import RemoveAdvertUseCase from 'application/usecases/adverts/RemoveAdvertUseCase';
import GetAdvertsUseCase from 'application/usecases/adverts/GetAdvertsUseCase';
import { AdvertModel } from 'domain/models/AdvertModel';

interface AdvertDeleteModalProps extends DialogOptions {
    advert: AdvertModel;
}

export default function DeleteAdvertModal({
    advert,
    onClose,
}: AdvertDeleteModalProps): ReactElement {
    const removeAdvertUseCase = Container.resolve(RemoveAdvertUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit(): Promise<boolean> {
        const result = await removeAdvertUseCase.handle(advert.id);

        if (result) {
            useInvalidateQuery([GetAdvertsUseCase.name]);
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
                {`Delete ${advert.name} advert?`}
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to delete this advert? This action cannot be undone.
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
