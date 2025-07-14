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
import GetAdvertsUseCase from 'application/usecases/adverts/GetAdvertsUseCase';
import { MultipleSelect, MultipleSelectOption } from 'presentation/components/form/fields/MultipleSelect';
import useFilter from 'presentation/hooks/useFilter';
import DateService from 'infrastructure/services/locale/DateService';
import useSelector from 'presentation/hooks/useSelector';
import { ButtonPaper, IconButtonPaper, ButtonPaperItem } from 'presentation/components/buttons';
import { themePalette } from 'presentation/theme';
import useDialog from 'presentation/hooks/useDialog';
import date from 'utils/date';
import Preload from 'presentation/components/preload/Preload';
import GetAdvertUseCase from 'application/usecases/adverts/GetAdvertUseCase';
import Img from 'presentation/components/common/Img';
import Tags from 'presentation/components/tags/Tags';
import StatusTag from 'presentation/components/tags/StatusTag';
import UpdateAdvertUseCase from 'application/usecases/adverts/UpdateAdvertUseCase';
import { AdvertModel } from 'domain/models/AdvertModel';
import DeleteAdvertModal from 'presentation/modals/adverts/DeleteAdvertModal';
import LockAdvertsModal from 'presentation/modals/adverts/LockAdvertsModal';
import DeleteAdvertsModal from 'presentation/modals/adverts/DeleteAdvertsModal';
import CreateAdvertModal from 'presentation/modals/adverts/CreateAdvertModal';
import AdvertCampaignsModal from 'presentation/modals/adverts/AdvertCampaignsModal';
import UpdateAdvertModal from 'presentation/modals/adverts/UpdateAdvertModal';
import { DatePicker } from 'presentation/components/decorators';

export default function AdvertsPage(): ReactElement {
    const getAdvertUseCase = Container.resolve(GetAdvertUseCase);
    const getAdvertsUseCase = Container.resolve(GetAdvertsUseCase);
    const updateAdvertUseCase = Container.resolve(UpdateAdvertUseCase);
    const dateService = Container.resolve(DateService);

    const { data: adverts } = useQuery(getAdvertsUseCase.handle, [GetAdvertsUseCase.name]);

    const {
        openDialog,
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
        createDialog((props) => <UpdateAdvertModal id={id} {...props} />)
            .open({
                maxWidth: 'lg',
            });
    }

    function openCampaignsDialog(id: number): void {
        openDialog((): ReactElement => <AdvertCampaignsModal id={id} />);
    }

    function openCreateDialog(): void {
        createDialog((props) => <CreateAdvertModal {...props} />)
            .open({
                maxWidth: 'lg',
            });
    }

    function openDeleteDialog(advert: AdvertModel): void {
        createDialog((props) => <DeleteAdvertModal advert={advert} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openLockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <LockAdvertsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openDeleteSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <DeleteAdvertsModal ids={ids} {...props} />)
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

    async function updateAdvert(formData: { id: number } & Partial<Omit<AdvertModel, 'id'>>) {
        const result = await updateAdvertUseCase.handle(formData);

        if (result) {
            useInvalidateQuery([GetAdvertsUseCase.name]);
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
                    <FormattedMessage id='adverts.title' />
                </Typography>
            </Row>

            <Row
                justifyContent='space-between'
                m={4}
                mb={4}
            >
                <Box width={400}>
                    <SearchField
                        autoCompleteRefs={filtered.map((item) => item.name)}
                        onChange={(value): void => setSearch(value, [
                            'id',
                            'name',
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

                    <ButtonIcon icon={<AddIcon />} onClick={() => openCreateDialog()}>
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
                                <TableCell>Linked campaigns</TableCell>

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
                                                    {item.name}
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
                                                <StatusTag
                                                    label='Locked'
                                                    status='locked'
                                                />
                                            )}
                                        </Tags>
                                    </TableCell>

                                    <TableCell>
                                        <Typography
                                            onClick={() => {
                                                if (!item.linkedCampaigns) return;
                                                openCampaignsDialog(item.id);
                                            }}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: item.linkedCampaigns ? 'pointer' : 'not-allowed',
                                            }}
                                        >
                                            <LinkIcon
                                                sx={{
                                                    fontSize: '1.4rem !important',
                                                    mr: 1,
                                                    rotate: '-45deg',
                                                }}
                                            />
                                            {item.linkedCampaigns ? item.linkedCampaigns.length : 0}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align='right'>
                                        <Preload
                                            on={() => usePrefetchQuery(
                                                () => getAdvertUseCase.handle(item.id),
                                                [GetAdvertUseCase.name, item.id],
                                            )}
                                        >
                                            <IconButtonPaper icon={<MoreVerticalIcon />}>
                                                <ButtonPaperItem
                                                    icon={item.isLocked ? <UnlockIcon /> : <LockIcon />}
                                                    label={item.isLocked ? 'Unlock' : 'Lock'}
                                                    onClick={() => updateAdvert({
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
                                                    disabled={!item.linkedCampaigns}
                                                    icon={<LinkIcon />}
                                                    label='Linked to...'
                                                    onClick={(): void => {
                                                        if (!item.linkedCampaigns) return;
                                                        openCampaignsDialog(item.id);
                                                    }}
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
