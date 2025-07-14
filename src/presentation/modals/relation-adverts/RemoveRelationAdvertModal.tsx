import React, { ReactElement } from 'react';
import {
    Button, Typography,
} from '@mui/material';
import RemoveRelationAdvertUseCase from 'application/usecases/relation-adverts/RemoveRelationAdvertUseCase';
import Container from 'infrastructure/services/Container';
import { RelationAdvertModel } from 'domain/models/RelationAdvertModel';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import GetRelationAdvertsUseCase from 'application/usecases/relation-adverts/GetRelationAdvertsUseCase';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { Box, Column, Row } from 'presentation/components/layout';
import { SubmitButton } from 'presentation/components';
import { themePalette } from 'presentation/theme';

interface RemoveRelationAdvertModalProps extends DialogOptions {
    advert: RelationAdvertModel;
}

export default function RemoveRelationAdvertModal({
    advert,
    onClose,
}: RemoveRelationAdvertModalProps): ReactElement {
    const removeRelationAdvertUseCase = Container.resolve(RemoveRelationAdvertUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit(): Promise<boolean> {
        const result = await removeRelationAdvertUseCase.handle(advert.id);

        if (result) {
            useInvalidateQuery([GetRelationAdvertsUseCase.name]);
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
                {`Delete advert id. ${advert.id}?`}
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
