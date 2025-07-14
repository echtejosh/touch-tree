import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import GetMediaItemUseCase from 'application/usecases/media/GetMediaItemUseCase';
import GetMediaUseCase from 'application/usecases/media/GetMediaUseCase';
import UpdateMediaUseCase from 'application/usecases/media/UpdateMediaUseCase';

interface LockPublicationsModalProps extends DialogOptions {
    ids: number[];
}

export default function LockPublicationsModal({
    ids,
    onClose,
}: LockPublicationsModalProps) {
    const getMediaItemUseCase = Container.resolve(GetMediaItemUseCase);
    const updateMediaUseCase = Container.resolve(UpdateMediaUseCase);

    const {
        handleSubmit,
    } = useForm();

    const mediaItemsQueries = ids.map((id) => useQuery(
        () => getMediaItemUseCase.handle(id),
        [GetMediaItemUseCase.name, id],
    ));

    async function onSubmit(): Promise<boolean> {
        const results = await Promise.all(
            mediaItemsQueries.map(async (query, index): Promise<boolean> => {
                const mediaItem = query.data;

                if (mediaItem?.isLocked) return true;

                return updateMediaUseCase.handle({
                    isLocked: true,
                    id: ids[index],
                });
            }),
        );

        const success = results.every((res): boolean => res);

        if (success) {
            useInvalidateQuery([GetMediaUseCase.name]);
            onClose();
        }

        return success;
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
                Lock selected publication(s)?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to lock selected publication(s)?
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
