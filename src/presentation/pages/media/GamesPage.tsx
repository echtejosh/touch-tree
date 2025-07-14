import React, { ReactElement, useEffect, useState } from 'react';
import Container from 'infrastructure/services/Container';

import { Box, Column, Row } from 'presentation/components/layout';
import {
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import SearchField from 'presentation/components/form/fields/SearchField';
import { MultipleSelect, MultipleSelectOption } from 'presentation/components/form/fields/MultipleSelect';
import { ButtonPaper, ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import { FilterIcon, LockIcon, MoreVerticalIcon, UnlockIcon } from 'presentation/components/icons';
import { useInvalidateQuery, useQuery } from 'presentation/hooks';
import useFilter from 'presentation/hooks/useFilter';
import Tags from 'presentation/components/tags/Tags';
import Tag from 'presentation/components/tags/Tag';
import GetGamesUseCase from 'application/usecases/games/GetGamesUseCase';
import StatusTag from 'presentation/components/tags/StatusTag';
import { themePalette } from 'presentation/theme';
import GetGameCategoriesUseCase from 'application/usecases/games/GetGameCategoriesUseCase';
import useSelector from 'presentation/hooks/useSelector';
import { GameModel } from 'domain/models/GameModel';
import UpdateGameUseCase from 'application/usecases/games/UpdateGameUseCase';
import LockGamesModal from 'presentation/modals/campaigns/media/games/LockGamesModal';
import useDialog from 'presentation/hooks/useDialog';
import UnlockGamesModal from 'presentation/modals/campaigns/media/games/UnlockGamesModal';

export default function GamesPage() {
    const getGamesUseCase = Container.resolve(GetGamesUseCase);
    const getGameCategoriesUseCase = Container.resolve(GetGameCategoriesUseCase);
    const updateGameUseCase = Container.resolve(UpdateGameUseCase);

    const [selectedStatuses, setSelectedStatuses] = useState<MultipleSelectOption<string>[]>([]);
    const [selectedGameCategories, setSelectedGameCategories] = useState<MultipleSelectOption<string>[]>([]);

    const {
        createDialog,
    } = useDialog();

    const { data: games } = useQuery(getGamesUseCase.handle, [GetGamesUseCase.name]);
    const { data: gameCategories } = useQuery(getGameCategoriesUseCase.handle, [GetGameCategoriesUseCase.name]);

    const {
        setFilter,
        setSearch,
        filtered,
    } = useFilter(games || []);

    const {
        selected,
        isAllSelected,
        select,
        selectAll,
        deselectAll,
    } = useSelector(filtered);

    function openLockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <LockGamesModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openUnlockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <UnlockGamesModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    async function updateGame(values: Partial<GameModel>) {
        const result = await updateGameUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetGamesUseCase.name]);
        }

        return result;
    }

    useEffect(() => {
        setFilter('status', ({ isLocked }) => {
            const values = selectedStatuses.map((item) => item.value);

            if (!values.length) {
                return true;
            }

            return values.includes(isLocked ? 'locked' : 'live');
        });
    }, [selectedStatuses]);

    useEffect(() => {
        setFilter('category', ({ objectGameSelectedTypes }) => {
            const values = selectedGameCategories.map((item) => item.value);

            if (!values.length) {
                return true;
            }

            return values.every((value) => objectGameSelectedTypes.some(({ id }) => String(id) === value));
        });
    }, [selectedGameCategories]);

    return (
        <Box>
            <Column gap={4}>
                <Row justifyContent='space-between'>
                    <Row width={400}>
                        <SearchField
                            autoCompleteRefs={filtered.map((item) => item.label)}
                            onChange={(value): void => setSearch(value, [
                                'id',
                                'label',
                            ])}
                            size='small'
                        />
                    </Row>

                    <Row>
                        <ButtonPaper icon={<FilterIcon />} label='Filters'>
                            <Typography fontWeight={600}>
                                Filters
                            </Typography>

                            <Column>
                                <MultipleSelect
                                    label='Status'
                                    onChange={(_, values) => setSelectedStatuses(values)}
                                    options={[
                                        {
                                            value: 'live',
                                            name: 'Live',
                                        },
                                        {
                                            value: 'locked',
                                            name: 'Locked',
                                        },
                                    ]}
                                    size='small'
                                    sx={{
                                        minWidth: 400,
                                    }}
                                    value={selectedStatuses}
                                />

                                <MultipleSelect
                                    label='Category'
                                    onChange={(_, values) => setSelectedGameCategories(values)}
                                    options={gameCategories?.map(({ id, label }) => ({
                                        value: String(id),
                                        name: label,
                                    })) || []}
                                    size='small'
                                    sx={{
                                        minWidth: 400,
                                    }}
                                    value={selectedGameCategories}
                                />
                            </Column>
                        </ButtonPaper>
                    </Row>
                </Row>

                <Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding='checkbox'>
                                        <Checkbox
                                            checked={isAllSelected}
                                            indeterminate={selected.length > 0 && !isAllSelected}
                                            onChange={(event): void => {
                                                if (event.target.checked) {
                                                    selectAll();
                                                } else {
                                                    deselectAll();
                                                }
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Row alignItems='center' gap={1} ml={-2}>
                                            <IconButtonPaper icon={<MoreVerticalIcon />}>
                                                <ButtonPaperItem
                                                    icon={<LockIcon />}
                                                    label='Lock selected'
                                                    onClick={openLockSelectedDialog}
                                                />

                                                <ButtonPaperItem
                                                    icon={<UnlockIcon />}
                                                    label='Unlock selected'
                                                    onClick={openUnlockSelectedDialog}
                                                />
                                            </IconButtonPaper>

                                            Name
                                        </Row>
                                    </TableCell>

                                    <TableCell>Categories</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align='right'>Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filtered.map((item): ReactElement => (
                                    <TableRow key={item.id}>
                                        <TableCell padding='checkbox'>
                                            <Checkbox
                                                checked={selected.includes(item.id.toString())}
                                                onChange={(): void => select(item.id.toString())}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Row alignItems='center' gap={2}>
                                                {item.imageUrl ? (
                                                    <Box
                                                        height={65}
                                                        sx={{
                                                            backgroundImage: `${`url(${item.imageUrl}` as string})`,
                                                            backgroundSize: 'cover',
                                                            borderRadius: 1,
                                                        }}
                                                        width={65}
                                                    />
                                                ) : (
                                                    <Box
                                                        height={65}
                                                        sx={{
                                                            backgroundColor: '#f1f1f1',
                                                            borderRadius: 1,
                                                        }}
                                                        width={65}
                                                    />
                                                )}

                                                <Column gap={0}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 500,
                                                            alignItems: 'center',
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Typography>
                                                </Column>
                                            </Row>
                                        </TableCell>

                                        <TableCell>
                                            <Tags>
                                                {item.objectGameSelectedTypes?.map((category) => {
                                                    return (
                                                        <Tag
                                                            key={category.id}
                                                            id={category.id?.toString()}
                                                            label={category.label}
                                                        />
                                                    );
                                                })}
                                            </Tags>
                                        </TableCell>

                                        <TableCell>
                                            <Tags>
                                                <StatusTag
                                                    label={item.isLocked ? 'Locked' : 'Live'}
                                                    status={item.isLocked ? 'locked' : 'live'}
                                                    sx={{ background: themePalette.border.light }}
                                                />
                                            </Tags>
                                        </TableCell>

                                        <TableCell align='right'>
                                            <IconButtonPaper icon={<MoreVerticalIcon />}>
                                                <ButtonPaperItem
                                                    icon={item.isLocked ? <UnlockIcon /> : <LockIcon />}
                                                    label={item.isLocked ? 'Unlock' : 'Lock'}
                                                    onClick={() => updateGame({
                                                        id: item.id,
                                                        isLocked: !item.isLocked,
                                                    })}
                                                />
                                            </IconButtonPaper>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Column>
        </Box>
    );
}
