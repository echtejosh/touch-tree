import React, { ReactElement, useEffect, useState } from 'react';
import { Box, Row } from 'presentation/components/layout';
import SearchField from 'presentation/components/form/fields/SearchField';
import {
    Avatar,
    AvatarGroup,
    Checkbox, IconButton, Paper,
    Table, TableBody,
    TableCell,
    TableContainer, TableHead, TableRow,
    Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import ButtonIcon from 'presentation/components/buttons/ButtonIcon';
import {
    AddIcon, ArchiveIcon,
    EditIcon, FileCopyIcon,
    FilterIcon,
    LinkIcon,
    LockIcon,
    MoreVerticalIcon, QrCodeIcon, UnlockIcon,
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
import date from 'utils/date';
import Preload from 'presentation/components/preload/Preload';
import CreateCampaignModal from 'presentation/modals/campaigns/CreateCampaignModal';
import GetCampaignUseCase from 'application/usecases/campaigns/GetCampaignUseCase';
import GetCampaignsUseCase from 'application/usecases/campaigns/GetCampaignsUseCase';
import UpdateCampaignModal from 'presentation/modals/campaigns/UpdateCampaignModal';
import Tags from 'presentation/components/tags/Tags';
import LockCampaignsModal from 'presentation/modals/campaigns/LockCampaignsModal';
import UpdateCampaignUseCase from 'application/usecases/campaigns/UpdateCampaignUseCase';
import { CampaignModel } from 'domain/models/CampaignModel';
import DeleteCampaignsModal from 'presentation/modals/campaigns/DeleteCampaignsModal';
import DeleteCampaignModal from 'presentation/modals/campaigns/DeleteCampaignModal';
import DuplicateCampaignModal from 'presentation/modals/campaigns/DuplicateCampaignModal';
import { DatePicker } from 'presentation/components/decorators';
import QrCodeModal from 'presentation/modals/QrCodeModal';

export default function CampaignsPage(): ReactElement {
    const getCampaignUseCase = Container.resolve(GetCampaignUseCase);
    const getCampaignsUseCase = Container.resolve(GetCampaignsUseCase);
    const updateCampaignUseCase = Container.resolve(UpdateCampaignUseCase);
    const dateService = Container.resolve(DateService);

    const { data: campaigns } = useQuery(getCampaignsUseCase.handle, [GetCampaignsUseCase.name]);
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
    } = useFilter(campaigns || []);

    const {
        selected,
        isAllSelected,
        select,
        selectAll,
        deselectAll,
    } = useSelector(filtered);

    async function updateCampaign(formData: { id: number } & Partial<Omit<CampaignModel, 'id'>>) {
        const result = await updateCampaignUseCase.handle(formData);

        if (result) {
            useInvalidateQuery([GetCampaignsUseCase.name]);
        }

        return result;
    }

    function openUpdateDialog(id: number): void {
        openDialog((props): ReactElement => <UpdateCampaignModal id={id} {...props} />);
    }

    function openCreateDialog(): void {
        openDialog((props): ReactElement => <CreateCampaignModal {...props} />);
    }

    function openLockSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <LockCampaignsModal ids={ids} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openDeleteSelectedDialog(): void {
        if (selected.length === 0) return;

        const ids = selected.map((id) => Number(id));

        createDialog((props) => <DeleteCampaignsModal ids={ids} {...props} />)
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

    function openDuplicateDialog(campaign: CampaignModel): void {
        createDialog((props) => <DuplicateCampaignModal campaign={campaign} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openDeleteDialog(campaign: CampaignModel): void {
        createDialog((props) => <DeleteCampaignModal campaign={campaign} {...props} />)
            .open({
                maxWidth: 'sm',
            });
    }

    function openQrCodeDialog(url: string) {
        openDialog(() => <QrCodeModal url={url} />);
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

            if (!values.length) {
                return true;
            }

            return values.every((value) => {
                if (value === 'locked') {
                    return isLocked;
                }
                return status === value;
            });
        });
    }, [selectedStatuses]);

    return (
        <Box>
            <Row
                p={4}
                pb={0}
            >
                <Typography variant='h1'>
                    <FormattedMessage id='campaigns.title' />
                </Typography>
            </Row>

            <Row
                justifyContent='space-between'
                m={4}
                mb={4}
            >
                <Box width={400}>
                    <SearchField
                        autoCompleteRefs={filtered.map((item) => item.name.toString())}
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

                    <ButtonIcon icon={<AddIcon />} onClick={openCreateDialog}>
                        Create campaign
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
                                                icon={<ArchiveIcon />}
                                                label='Archive selected'
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
                                <TableCell />
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
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                }}
                                            >
                                                {item.name}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    color: themePalette.text.light,
                                                    display: 'flex',
                                                    gap: 0.5,
                                                }}
                                                variant='body2'
                                            >
                                                {{
                                                    3: 'Time-based campaign',
                                                    1: 'Geo-location campaign',
                                                    2: 'IP-address campaign',
                                                }[item.type]}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {item.startDate ? dateService.format(item.startDate) : String()}
                                        </TableCell>

                                        <TableCell>
                                            {item.endDate ? dateService.format(item.endDate) : String()}
                                        </TableCell>

                                        <TableCell align='left'>
                                            <AvatarGroup
                                                max={4}
                                                sx={{ justifyContent: 'start' }}
                                                variant='rounded'
                                            >
                                                {item.adverts.sort((a, b) => a.id - b.id)?.map((advert) => (
                                                    <Avatar
                                                        key={`avatar-${advert.id}`}
                                                        alt={`Linked advert image with id: ${advert.id}`}
                                                        src={advert.imageUrl}
                                                    />
                                                ))}
                                            </AvatarGroup>
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
                                            <Row alignItems='center' gap={0}>
                                                <IconButton
                                                    onClick={() => openQrCodeDialog(item.url as string)}
                                                    sx={{ color: themePalette.text.main }}
                                                >
                                                    <QrCodeIcon />
                                                </IconButton>

                                                <Preload
                                                    on={() => usePrefetchQuery(
                                                        () => getCampaignUseCase.handle(item.id),
                                                        [GetCampaignUseCase.name, item.id],
                                                    )}
                                                >
                                                    <IconButtonPaper icon={<MoreVerticalIcon />}>
                                                        <ButtonPaperItem
                                                            icon={item.isLocked ? <UnlockIcon /> : <LockIcon />}
                                                            label={item.isLocked ? 'Unlock' : 'Lock'}
                                                            onClick={() => updateCampaign({
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
                                                            icon={<FileCopyIcon />}
                                                            label='Duplicate'
                                                            onClick={(): void => openDuplicateDialog(item)}
                                                        />

                                                        <ButtonPaperItem
                                                            icon={<ArchiveIcon />}
                                                            label='Archive'
                                                            onClick={() => openDeleteDialog(item)}
                                                        />
                                                    </IconButtonPaper>
                                                </Preload>
                                            </Row>
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
