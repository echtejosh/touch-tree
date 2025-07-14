import React, { ReactElement, useEffect, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import SearchField from 'presentation/components/form/fields/SearchField';
import {
    Checkbox, Paper,
    Table, TableBody,
    TableCell,
    TableContainer, TableHead, TableRow,
    Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import ButtonIcon from 'presentation/components/buttons/ButtonIcon';
import {
    AddIcon, DeleteIcon,
    EditIcon,
    FilterIcon,
    LinkIcon,
    LockIcon,
    MoreVerticalIcon,
    UnlockIcon,
} from 'presentation/components/icons';
import Container from 'infrastructure/services/Container';
import { useInvalidateQuery, usePrefetchQuery, useQuery } from 'presentation/hooks';
import { MultipleSelect, MultipleSelectOption } from 'presentation/components/form/fields/MultipleSelect';
import useFilter from 'presentation/hooks/useFilter';
import DateService from 'infrastructure/services/locale/DateService';
import useSelector from 'presentation/hooks/useSelector';
import StatusTag from 'presentation/components/tags/StatusTag';
import { ButtonPaper, IconButtonPaper, ButtonPaperItem } from 'presentation/components/buttons';
import { themePalette } from 'presentation/theme';
import useDialog from 'presentation/hooks/useDialog';
import Preload from 'presentation/components/preload/Preload';
import GetHighlightUseCase from 'application/usecases/highlights/GetHighlightUseCase';
import GetHighlightsUseCase from 'application/usecases/highlights/GetHighlightsUseCase';
import UpdateHighlightUseCase from 'application/usecases/highlights/UpdateHighlightUseCase';
import { HighlightModel } from 'domain/models/HighlightModel';
import HighlightEditModal from 'presentation/modals/highlights/UpdateHighlightModal';
import date from 'utils/date';
import Img from 'presentation/components/common/Img';
import Tags from 'presentation/components/tags/Tags';
import DeleteHighlightModal from 'presentation/modals/highlights/DeleteHighlightModal';
import DeleteHighlightsModal from 'presentation/modals/highlights/DeleteHighlightsModal';
import LockHighlightsModal from 'presentation/modals/highlights/LockHighlightsModal';
import CreateHighlightModal from 'presentation/modals/highlights/CreateHighlightModal';
import { DatePicker } from 'presentation/components/decorators';

export default function HighlightsPage(): ReactElement {
    const getHighlightUseCase = Container.resolve(GetHighlightUseCase);
    const getHighlightsUseCase = Container.resolve(GetHighlightsUseCase);
    const updateHighlightUseCase = Container.resolve(UpdateHighlightUseCase);
    const dateService = Container.resolve(DateService);

    const { data: highlights } = useQuery(getHighlightsUseCase.handle, [GetHighlightsUseCase.name]);

    const { createDialog } = useDialog();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<MultipleSelectOption<string>[]>([]);

    const {
        setSearch,
        setFilter,
        filtered,
    } = useFilter(highlights || []);

    const {
        selected,
        isAllSelected,
        select,
        selectAll,
        deselectAll,
    } = useSelector(filtered);

    function openUpdateDialog(id: number): void {
        createDialog((props) => <HighlightEditModal id={id} {...props} />)
            .open({
                maxWidth: 'lg',
            });
    }

    function openCreateDialog(): void {
        createDialog((props) => <CreateHighlightModal {...props} />)
            .open({
                maxWidth: 'lg',
            });
    }

    function openDeleteDialog(highlight: HighlightModel): void {
        createDialog((props) => <DeleteHighlightModal highlight={highlight} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openDeleteSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <DeleteHighlightsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openLockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <LockHighlightsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    async function updateHighlight(formData: { id: number } & Partial<Omit<HighlightModel, 'id'>>) {
        const result = await updateHighlightUseCase.handle(formData);

        if (result) {
            useInvalidateQuery([GetHighlightsUseCase.name]);
        }

        return result;
    }

    function selectOnlyIfExpired() {
        const expiredIds = filtered
            .filter((item) => item.status === 'expired')
            .map((item) => item.id.toString());

        deselectAll();

        expiredIds.forEach((id) => select(id));
    }

    useEffect(() => {
        setFilter('date', (props) => {
            const {
                startDate: start,
                endDate: end,
            } = props;

            if (!start || !end || !startDate || !endDate) {
                return true;
            }

            return date.inRangeOf(startDate, start, end) && date.inRangeOf(endDate, start, end);
        });
    }, [startDate, endDate, setFilter]);

    useEffect(() => {
        setFilter('status', ({
            status,
            isLocked,
        }) => {
            const values = selectedStatuses.map((item) => item.value);

            if (!values.length || (values.includes('locked') && isLocked)) {
                return true;
            }

            return values.includes(status);
        });
    }, [selectedStatuses]);

    return (
        <Box>
            <Row p={4} pb={0}>
                <Typography variant='h1'>
                    <FormattedMessage id='highlights.title' />
                </Typography>
            </Row>

            <Row justifyContent='space-between' m={4} mb={4}>
                <Box width={400}>
                    <SearchField
                        onChange={(value): void => setSearch(value, ['id', 'title', 'status'])}
                        size='small'
                    />
                </Box>

                <Row>
                    <ButtonPaper icon={<FilterIcon />} label='Filters'>
                        <Typography fontWeight={600}>Filters</Typography>

                        <Row alignItems='center'>
                            <DatePicker
                                label='From'
                                onChange={setStartDate}
                                value={startDate}
                            />

                            <DatePicker
                                label='To'
                                onChange={setEndDate}
                                value={endDate}
                            />
                        </Row>

                        <Row alignItems='center'>
                            <MultipleSelect
                                label='Status'
                                onChange={(_, values) => setSelectedStatuses(values)}
                                options={[
                                    {
                                        value: 'live',
                                        name: 'Live',
                                    },
                                    {
                                        value: 'expired',
                                        name: 'Expired',
                                    },
                                    {
                                        value: 'locked',
                                        name: 'Locked',
                                    },
                                    {
                                        value: 'draft',
                                        name: 'Draft',
                                    },
                                ]}
                                size='small'
                                sx={{
                                    flex: 1,
                                }}
                                value={selectedStatuses}
                            />
                        </Row>
                    </ButtonPaper>

                    <ButtonIcon icon={<AddIcon />} onClick={() => openCreateDialog()}>
                        Create highlight
                    </ButtonIcon>
                </Row>
            </Row>

            <Box sx={{ m: 4 }}>
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
                                                icon={<DeleteIcon />}
                                                label='Delete selected'
                                                onClick={openDeleteSelectedDialog}
                                            />
                                            <ButtonPaperItem
                                                icon={<LinkIcon />}
                                                label='Select expired'
                                                onClick={selectOnlyIfExpired}
                                            />
                                        </IconButtonPaper>
                                        Name
                                    </Row>
                                </TableCell>

                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Status</TableCell>

                                <TableCell width={100}>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filtered.map((item): ReactElement => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell padding='checkbox'>
                                            <Checkbox
                                                checked={selected.includes(item.id.toString())}
                                                onChange={(): void => select(item.id.toString())}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Row alignItems='center' gap={2}>
                                                <Img
                                                    height={60}
                                                    src={item.image?.content as string}
                                                    sx={{
                                                        backgroundSize: 'cover',
                                                        borderRadius: 1,
                                                    }}
                                                    width={100}
                                                />

                                                <Column gap={0}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 500,
                                                            alignItems: 'center',
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Typography>

                                                    <Row alignItems='center' gap={0.5}>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 500,
                                                                color: themePalette.text.light,
                                                            }}
                                                            variant='body2'
                                                        >
                                                            Id.
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontWeight: 500,
                                                                color: themePalette.text.light,
                                                            }}
                                                            variant='body2'
                                                        >
                                                            {item.id}
                                                        </Typography>
                                                    </Row>
                                                </Column>
                                            </Row>
                                        </TableCell>

                                        <TableCell>
                                            {item.startDate ? dateService.format(item.startDate) : String()}
                                        </TableCell>

                                        <TableCell>
                                            {item.endDate ? dateService.format(item.endDate) : String()}
                                        </TableCell>

                                        <TableCell>
                                            <Tags>
                                                <StatusTag status={item.status} />

                                                {(item.isLocked && item.status !== 'locked') && (
                                                    <StatusTag label='Locked' status='locked' />
                                                )}
                                            </Tags>
                                        </TableCell>

                                        <TableCell align='right'>
                                            <Preload
                                                on={() => usePrefetchQuery(
                                                    () => getHighlightUseCase.handle(item.id),
                                                    [GetHighlightUseCase.name, item.id],
                                                )}
                                            >
                                                <IconButtonPaper icon={<MoreVerticalIcon />}>
                                                    <ButtonPaperItem
                                                        icon={item.isLocked ? <UnlockIcon /> : <LockIcon />}
                                                        label={item.isLocked ? 'Unlock' : 'Lock'}
                                                        onClick={() => updateHighlight({
                                                            id: item.id,
                                                            isLocked: !item.isLocked,
                                                        })}
                                                    />

                                                    <ButtonPaperItem
                                                        icon={<EditIcon />}
                                                        label='Edit'
                                                        onClick={(): void => openUpdateDialog(item.id)}
                                                    />

                                                    <ButtonPaperItem
                                                        icon={<DeleteIcon />}
                                                        label='Delete'
                                                        onClick={() => openDeleteDialog(item)}
                                                    />
                                                </IconButtonPaper>
                                            </Preload>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}
