import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import Container from 'infrastructure/services/Container';

import GetMediaUseCase from 'application/usecases/media/GetMediaUseCase';
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
import UpdateMediaUseCase from 'application/usecases/media/UpdateMediaUseCase';
import { MediaModel } from 'domain/models/MediaModel';
import Tag from 'presentation/components/tags/Tag';
import useSelector from 'presentation/hooks/useSelector';
import useDialog from 'presentation/hooks/useDialog';
import LockPublicationsModal from 'presentation/modals/campaigns/media/publications/LockPublicationsModal';
import UnlockPublicationsModal from 'presentation/modals/campaigns/media/publications/UnlockPublicationsModal';
import GetMediaCategoriesUseCase from 'application/usecases/media/GetMediaCategoriesUseCase';

export const PublicationTypes = {
    Magazine: 0,
    Newspaper: 1,
} as const;

export type PublicationTypeValue = typeof PublicationTypes[keyof typeof PublicationTypes];

const PUBLICATION_TYPE_OPTIONS: MultipleSelectOption<PublicationTypeValue>[] = [
    { value: PublicationTypes.Magazine, name: 'Magazine' },
    { value: PublicationTypes.Newspaper, name: 'Newspaper' },
];

export default function PublicationsPage() {
    const getMediaUseCase = Container.resolve(GetMediaUseCase);
    const getMediaCategoriesUseCase = Container.resolve(GetMediaCategoriesUseCase);
    const updateMediaUseCase = Container.resolve(UpdateMediaUseCase);

    const [selectedStatuses, setSelectedStatuses] = useState<MultipleSelectOption<string>[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<MultipleSelectOption<string>[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<MultipleSelectOption<string>[]>([]);
    const [selectedPubTypes, setSelectedPubTypes] = useState<MultipleSelectOption<number>[]>([]);

    const {
        createDialog,
    } = useDialog();

    const { data: media } = useQuery(getMediaUseCase.handle, [GetMediaUseCase.name]);
    const { data: mediaCategories } = useQuery(getMediaCategoriesUseCase.handle, [GetMediaCategoriesUseCase.name]);

    const {
        setFilter,
        setSearch,
        filtered,
    } = useFilter(media || []);

    const {
        selected,
        isAllSelected,
        select,
        selectAll,
        deselectAll,
    } = useSelector(filtered);

    const uniqueCountries = useMemo(() => {
        return Array.from(new Set(media
            ?.map((item) => item.countryLabel)))
            .map((country) => ({
                value: country,
                name: country,
            }));
    }, [media]);

    const categories = useMemo(() => {
        return mediaCategories?.map(({ id, label }) => ({
            value: String(id),
            name: label,
        })) || [];
    }, [mediaCategories]);

    function openLockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <LockPublicationsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openUnlockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <UnlockPublicationsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    async function updateMedia(values: Partial<MediaModel>) {
        const result = await updateMediaUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetMediaUseCase.name]);
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

    useEffect(() => {
        setFilter('pubType', ({ isNewspaper }) => {
            const values = selectedPubTypes.map((item) => item.value);

            if (!values.length) {
                return true;
            }

            const publicationType = isNewspaper
                ? PublicationTypes.Newspaper
                : PublicationTypes.Magazine;

            return values.every((value) => value === publicationType);
        });
    }, [selectedPubTypes]);

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

                                <MultipleSelect
                                    label='Publication type'
                                    onChange={(_, values) => setSelectedPubTypes(values)}
                                    options={PUBLICATION_TYPE_OPTIONS}
                                    size='small'
                                    sx={{
                                        minWidth: 400,
                                    }}
                                    value={selectedPubTypes}
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
                                                        height={90}
                                                        sx={{
                                                            backgroundImage: `${`url(${item.latestBranchLowRes}` as string})`,
                                                            backgroundSize: 'cover',
                                                            borderRadius: 1,
                                                        }}
                                                        width={65}
                                                    />
                                                ) : (
                                                    <Box
                                                        height={90}
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

                                        <TableCell>
                                            {item.countryLabel}
                                        </TableCell>

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
                                                    onClick={() => updateMedia({
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
