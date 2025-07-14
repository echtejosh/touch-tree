import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import GetPodcastUseCase from 'application/usecases/media/GetPodcastUseCase';
import GetPodcastsUseCase from 'application/usecases/media/GetPodcastsUseCase';
import UpdatePodcastUseCase from 'application/usecases/media/UpdatePodcastUseCase';

interface LockPodcastsModalProps extends DialogOptions {
    ids: number[];
}

export default function LockPodcastsModal({
    ids,
    onClose,
}: LockPodcastsModalProps) {
    const getPodcastUseCase = Container.resolve(GetPodcastUseCase);
    const updatePodcastUseCase = Container.resolve(UpdatePodcastUseCase);

    const { handleSubmit } = useForm();

    const podcastItemsQueries = ids.map((id) => useQuery(
        () => getPodcastUseCase.handle(id),
        [GetPodcastUseCase.name, id],
    ));

    async function onSubmit(): Promise<boolean> {
        const results = await Promise.all(
            podcastItemsQueries.map(async (query, index): Promise<boolean> => {
                const podcastItem = query.data;

                if (podcastItem?.isLocked) return true;

                return updatePodcastUseCase.handle({
                    isLocked: true,
                    id: ids[index],
                });
            }),
        );

        const success = results.every((res): boolean => res);

        if (success) {
            useInvalidateQuery([GetPodcastsUseCase.name]);
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
                Lock selected podcast(s)?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to lock selected podcast(s)?
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
