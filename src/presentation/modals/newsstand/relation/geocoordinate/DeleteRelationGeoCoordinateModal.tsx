import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { themePalette } from 'presentation/theme';
import RemoveRelationGeoCoordinateUseCase from 'application/usecases/newsstand/relation/coordinates/RemoveRelationGeoCoordinateUseCase';
import GetRelationGeoCoordinatesUseCase from 'application/usecases/newsstand/relation/coordinates/GetRelationGeoCoordinatesUseCase';
import GetRelationGeoCoordinateUseCase from 'application/usecases/newsstand/relation/coordinates/GetRelationGeoCoordinateUseCase';

interface DeleteCampaignGeoCoordinatesModalProps extends DialogOptions {
    id: number;
}

export default function DeleteRelationGeoCoordinateModal({
    id,
    onClose,
}: DeleteCampaignGeoCoordinatesModalProps) {
    const getRelationGeoCoordinateUseCase = Container.resolve(GetRelationGeoCoordinateUseCase);
    const removeRelationGeoCoordinateUseCase = Container.resolve(RemoveRelationGeoCoordinateUseCase);

    const { data: geoCoordinate } = useQuery(() => getRelationGeoCoordinateUseCase.handle(id), [GetRelationGeoCoordinateUseCase.name, id]);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit() {
        const result = await removeRelationGeoCoordinateUseCase.handle(id);

        if (result) {
            useInvalidateQuery([GetRelationGeoCoordinatesUseCase.name]);
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
                {`Delete ${geoCoordinate?.label} geo coordinate?`}
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to delete this geo coordinate? This action cannot be undone.
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
