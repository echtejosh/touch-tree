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
    LockIcon,
    MoreVerticalIcon,
    UnlockIcon,
} from 'presentation/components/icons';
import Container from 'infrastructure/services/Container';
import { useInvalidateQuery, usePrefetchQuery, useQuery } from 'presentation/hooks';
import GetRelationAdvertsUseCase from 'application/usecases/relation-adverts/GetRelationAdvertsUseCase';
import { MultipleSelect, MultipleSelectOption } from 'presentation/components/form/fields/MultipleSelect';
import useFilter from 'presentation/hooks/useFilter';
import DateService from 'infrastructure/services/locale/DateService';
import useSelector from 'presentation/hooks/useSelector';
import { ButtonPaper, IconButtonPaper, ButtonPaperItem } from 'presentation/components/buttons';
import useDialog from 'presentation/hooks/useDialog';
import date from 'utils/date';
import Preload from 'presentation/components/preload/Preload';
import GetRelationAdvertUseCase from 'application/usecases/relation-adverts/GetRelationAdvertUseCase';
import Img from 'presentation/components/common/Img';
import Tags from 'presentation/components/tags/Tags';
import StatusTag from 'presentation/components/tags/StatusTag';
import UpdateRelationAdvertUseCase from 'application/usecases/relation-adverts/UpdateRelationAdvertUseCase';
import { RelationAdvertModel } from 'domain/models/RelationAdvertModel';
import { DatePicker } from 'presentation/components/decorators';
import CreateRelationAdvertModal from 'presentation/modals/relation-adverts/CreateRelationAdvertModal';
import RemoveRelationAdvertModal from 'presentation/modals/relation-adverts/RemoveRelationAdvertModal';
import UpdateRelationAdvertModal from 'presentation/modals/relation-adverts/UpdateRelationAdvertModal';
import LockRelationAdvertsModal from 'presentation/modals/relation-adverts/LockRelationAdvertsModal';
import RemoveRelationAdvertsModal from 'presentation/modals/relation-adverts/RemoveRelationAdvertsModal';

export default function RelationAdvertsPage(): ReactElement {
    const getRelationAdvertUseCase = Container.resolve(GetRelationAdvertUseCase);
    const getRelationAdvertsUseCase = Container.resolve(GetRelationAdvertsUseCase);
    const updateRelationAdvertUseCase = Container.resolve(UpdateRelationAdvertUseCase);
    const dateService = Container.resolve(DateService);

    const { data: adverts } = useQuery(getRelationAdvertsUseCase.handle, [GetRelationAdvertsUseCase.name]);

    const {
        createDialog,
    } = useDialog();

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<MultipleSelectOption<string>[]>([]);

    const {
        setSearch,
        setFilter,
        filtered,
    } = useFilter(adverts || []);

    const {
        selected,
        isAllSelected,
        select,
        selectAll,
        deselectAll,
    } = useSelector(filtered);

    function openUpdateDialog(id: number): void {
        createDialog((props) => <UpdateRelationAdvertModal id={id} {...props} />)
            .open({
                maxWidth: 'lg',
            });
    }

    function openCreateDialog(): void {
        createDialog((props) => <CreateRelationAdvertModal {...props} />)
            .open({
                maxWidth: 'lg',
            });
    }

    function openDeleteDialog(advert: RelationAdvertModel): void {
        createDialog((props) => <RemoveRelationAdvertModal advert={advert} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openLockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <LockRelationAdvertsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openDeleteSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <RemoveRelationAdvertsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function selectOnlyIfExpired() {
        const expiredIds = filtered
            .filter((item) => item.status === 'expired')
            .map((item) => item.id.toString());

        deselectAll();

        expiredIds.forEach((id) => select(id));
    }

    async function updateRelationAdvert(formData: { id: number } & Partial<Omit<RelationAdvertModel, 'id'>>) {
        const result = await updateRelationAdvertUseCase.handle(formData);

        if (result) {
            useInvalidateQuery([GetRelationAdvertsUseCase.name]);
        }

        return result;
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
            <Row
                p={4}
                pb={0}
            >
                <Typography variant='h1'>
                    <FormattedMessage id='relation-adverts.title' />
                </Typography>
            </Row>

            <Row
                justifyContent='space-between'
                m={4}
                mb={4}
            >
                <Box width={400}>
                    <SearchField
                        autoCompleteRefs={filtered.map((item) => String(item.id))}
                        onChange={(value): void => setSearch(value, [
                            'id',
                            'status',
                        ])}
                        size='small'
                    />
                </Box>

                <Row>
                    <ButtonPaper icon={<FilterIcon />} label='Filters'>
                        <Typography fontWeight={600}>
                            Filters
                        </Typography>

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

                    <ButtonIcon icon={<AddIcon />} onClick={openCreateDialog}>
                        Create advert
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
                                                icon={<UnlockIcon />}
                                                label='Select expired'
                                                onClick={selectOnlyIfExpired}
                                            />
                                        </IconButtonPaper>
                                        Id
                                    </Row>
                                </TableCell>

                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Type</TableCell>

                                <TableCell width={100}>Actions</TableCell>
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
                                                    {`Id. ${item.id}`}
                                                </Typography>
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
                                                <StatusTag
                                                    label='Locked'
                                                    status='locked'
                                                />
                                            )}
                                        </Tags>
                                    </TableCell>

                                    <TableCell sx={{ textTransform: 'capitalize' }}>
                                        {item.typeLabel}
                                    </TableCell>

                                    <TableCell align='right'>
                                        <Preload
                                            on={() => usePrefetchQuery(
                                                () => getRelationAdvertUseCase.handle(item.id),
                                                [GetRelationAdvertUseCase.name, item.id],
                                            )}
                                        >
                                            <IconButtonPaper icon={<MoreVerticalIcon />}>
                                                <ButtonPaperItem
                                                    icon={item.isLocked ? <UnlockIcon /> : <LockIcon />}
                                                    label={item.isLocked ? 'Unlock' : 'Lock'}
                                                    onClick={() => updateRelationAdvert({
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
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}
