import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import UpdateGameUseCase from 'application/usecases/games/UpdateGameUseCase';
import GetGamesUseCase from 'application/usecases/games/GetGamesUseCase';
import GetGameUseCase from 'application/usecases/games/GetGameUseCase';

interface LockGamesModalProps extends DialogOptions {
    ids: number[];
}

export default function LockGamesModal({
    ids,
    onClose,
}: LockGamesModalProps) {
    const getGameUseCase = Container.resolve(GetGameUseCase);
    const updateGamesUseCase = Container.resolve(UpdateGameUseCase);

    const {
        handleSubmit,
    } = useForm();

    const gamesQueries = ids.map((id) => useQuery(
        () => getGameUseCase.handle(id),
        [GetGamesUseCase.name, id],
    ));

    async function onSubmit(): Promise<boolean> {
        const results = await Promise.all(
            gamesQueries.map(async (query, index): Promise<boolean> => {
                const game = query.data;

                if (game?.isLocked) return true;

                return updateGamesUseCase.handle({
                    isLocked: true,
                    id: ids[index],
                });
            }),
        );

        const success = results.every((res): boolean => res);

        if (success) {
            useInvalidateQuery([GetGamesUseCase.name]);
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
                Lock selected game(s)?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to lock selected game(s)?
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
