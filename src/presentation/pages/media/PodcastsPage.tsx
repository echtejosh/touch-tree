import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import Container from 'infrastructure/services/Container';

import GetPodcastsUseCase from 'application/usecases/media/GetPodcastsUseCase';
import GetPodcastCategoriesUseCase from 'application/usecases/media/GetPodcastCategoriesUseCase';
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
import { themePalette } from 'presentation/theme';
import Tags from 'presentation/components/tags/Tags';
import StatusTag from 'presentation/components/tags/StatusTag';
import Tag from 'presentation/components/tags/Tag';
import useSelector from 'presentation/hooks/useSelector';
import UpdatePodcastUseCase from 'application/usecases/media/UpdatePodcastUseCase';
import { MediaModel } from 'domain/models/MediaModel';
import useDialog from 'presentation/hooks/useDialog';
import LockPodcastsModal from 'presentation/modals/campaigns/media/podcasts/LockPodcastsModal';
import UnlockPodcastsModal from 'presentation/modals/campaigns/media/podcasts/UnlockPodcastsModal';

export default function PodcastsPage() {
    const getPodcastsUseCase = Container.resolve(GetPodcastsUseCase);
    const getPodcastCategoriesUseCase = Container.resolve(GetPodcastCategoriesUseCase);
    const updatePodcastsUseCase = Container.resolve(UpdatePodcastUseCase);

    const [selectedStatuses, setSelectedStatuses] = useState<MultipleSelectOption<string>[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<MultipleSelectOption<string>[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<MultipleSelectOption<string>[]>([]);

    const { createDialog } = useDialog();

    const { data: podcasts } = useQuery(getPodcastsUseCase.handle, [GetPodcastsUseCase.name]);
    const { data: podcastCategories } = useQuery(getPodcastCategoriesUseCase.handle, [GetPodcastCategoriesUseCase.name]);

    const { setFilter, setSearch, filtered } = useFilter(podcasts || []);

    const { selected, isAllSelected, select, selectAll, deselectAll } = useSelector(filtered);

    const uniqueCountries = useMemo(() => {
        return Array.from(new Set(podcasts
            ?.map((item) => item.countryLabel)))
            .map((country) => ({
                value: country,
                name: country,
            }));
    }, [podcasts]);

    const categories = useMemo(() => {
        return podcastCategories?.map(({ id, label }) => ({
            value: String(id),
            name: label,
        })) || [];
    }, [podcastCategories]);

    function openLockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <LockPodcastsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openUnlockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <UnlockPodcastsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    async function updatePodcast(values: Partial<MediaModel>) {
        const result = await updatePodcastsUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetPodcastsUseCase.name]);
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
        setFilter('country', ({ countryLabel }) => {
            const values = selectedCountries.map((item) => item.value.toLowerCase());

            if (!values.length) {
                return true;
            }

            return values.every((value) => countryLabel.toLowerCase().includes(value));
        });
    }, [selectedCountries]);

    useEffect(() => {
        setFilter('category', ({ objectCategories }) => {
            const values = selectedCategories.map((item) => item.value);

            if (!values.length) {
                return true;
            }

            if (!objectCategories) {
                return false;
            }

            return values.every((value) => objectCategories.some(({ id }) => String(id) === value));
        });
    }, [selectedCategories]);

    return (
        <Box>
            <Column gap={4}>
                <Row justifyContent='space-between'>
                    <Row width={400}>
                        <SearchField
                            autoCompleteRefs={filtered.map((item) => item.fullName)}
                            onChange={(value): void => setSearch(value, [
                                'id',
                                'fullName',
                                'countryLabel',
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
                                    label='Country'
                                    onChange={(_, values) => setSelectedCountries(values)}
                                    options={uniqueCountries}
                                    size='small'
                                    sx={{
                                        minWidth: 400,
                                    }}
                                    value={selectedCountries}
                                />

                                <MultipleSelect
                                    label='Category'
                                    onChange={(_, values) => setSelectedCategories(values)}
                                    options={categories}
                                    size='small'
                                    sx={{
                                        minWidth: 400,
                                    }}
                                    value={selectedCategories}
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
                                    <TableCell>Country</TableCell>
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
                                                {item.latestBranchLowRes ? (
                                                    <Box
                                                        height={65}
                                                        sx={{
                                                            backgroundImage: `${`url(${item.latestBranchLowRes}` as string})`,
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
                                                        {item.fullName}
                                                    </Typography>
                                                </Column>
                                            </Row>
                                        </TableCell>

                                        <TableCell>{item.countryLabel}</TableCell>

                                        <TableCell>
                                            <Tags>
                                                {item.objectCategories?.map((category) => {
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
                                                    onClick={() => updatePodcast({
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
