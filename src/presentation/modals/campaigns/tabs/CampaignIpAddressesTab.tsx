import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box, Column, Row } from 'presentation/components/layout';
import React, { ReactElement } from 'react';
import { themePalette } from 'presentation/theme';
import SearchField from 'presentation/components/form/fields/SearchField';
import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import useFilter from 'presentation/hooks/useFilter';
import GetCampaignUseCase from 'application/usecases/campaigns/GetCampaignUseCase';
import useDialog from 'presentation/hooks/useDialog';
import CreateCampaignIpAddressModal from 'presentation/modals/campaigns/ipaddress/CreateCampaignIpAddressModal';
import { ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import { DeleteIcon, EditIcon, MoreVerticalIcon } from 'presentation/components/icons';
import UpdateCampaignIpAddressModal from 'presentation/modals/campaigns/ipaddress/UpdateCampaignIpAddressModal';
import DeleteCampaignIpAddressModal from 'presentation/modals/campaigns/ipaddress/DeleteCampaignIpAddressModal';
import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';

export interface CampaignIpAddressTabProps {
    id: number;
}

export default function CampaignIpAddressesTab({
    id,
}: CampaignIpAddressTabProps) {
    const getCampaignUseCase = Container.resolve(GetCampaignUseCase);

    const { data: campaign } = useQuery(() => getCampaignUseCase.handle(id), [GetCampaignUseCase.name, id]);
    const { openDialog } = useDialog();

    const {
        setSearch,
        filtered,
    } = useFilter(campaign?.ips || []);

    function openCreateDialog() {
        openDialog((props) => <CreateCampaignIpAddressModal campaignId={campaign?.id as number} {...props} />);
    }

    function openUpdateDialog(_id: number) {
        openDialog((props) => <UpdateCampaignIpAddressModal id={_id} {...props} />);
    }

    function openDeleteDialog(ipAddress: CampaignIpAddressModel) {
        openDialog((props) => <DeleteCampaignIpAddressModal ipAddress={ipAddress} {...props} />);
    }

    return (
        <Box>
            <Typography fontWeight={600}>
                Manage IP addresses
            </Typography>

            <Row my={3}>
                <SearchField
                    autoCompleteRefs={filtered?.map((ip) => ip?.label?.toString() as string)}
                    fullWidth
                    onChange={(value): void => setSearch(value, [
                        'id',
                        'label',
                    ])}
                    size='small'
                    sx={{ zIndex: 9999 }}
                />

                <Button
                    onClick={openCreateDialog}
                    variant='contained'
                >
                    Create IP address
                </Button>
            </Row>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Range</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filtered.map((item): ReactElement => (
                            <TableRow
                                key={item.id}
                                hover
                            >
                                <TableCell>
                                    <Row alignItems='center' gap={2}>
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

                                <TableCell>{item.ip}</TableCell>
                                <TableCell>{item.range}</TableCell>

                                <TableCell align='right'>
                                    <IconButtonPaper
                                        icon={<MoreVerticalIcon />}
                                        zIndex={9999}
                                    >
                                        <ButtonPaperItem
                                            icon={<EditIcon />}
                                            label='Edit'
                                            onClick={() => openUpdateDialog(item.id)}
                                        />

                                        <ButtonPaperItem
                                            icon={<DeleteIcon />}
                                            label='Delete'
                                            onClick={() => openDeleteDialog(item)}
                                        />
                                    </IconButtonPaper>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
