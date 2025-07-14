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
import { ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import { DeleteIcon, EditIcon, MoreVerticalIcon } from 'presentation/components/icons';
import { CampaignGeoCoordinateModel } from 'domain/models/CampaignGeoCoordinateModel';
import DeleteCampaignGeoCoordinateModal
    from 'presentation/modals/campaigns/geocoordinate/DeleteCampaignGeoCoordinateModal';
import CreateCampaignGeoCoordinateModal
    from 'presentation/modals/campaigns/geocoordinate/CreateCampaignGeoCoordinateModal';
import UpdateCampaignGeoCoordinateModal
    from 'presentation/modals/campaigns/geocoordinate/UpdateCampaignGeoCoordinateModal';

export interface CampaignGeoCoordinatesTabProps {
    id: number;
}

export default function CampaignGeoCoordinatesTab({
    id,
}: CampaignGeoCoordinatesTabProps) {
    const getCampaignUseCase = Container.resolve(GetCampaignUseCase);

    const { data: campaign } = useQuery(() => getCampaignUseCase.handle(id), [GetCampaignUseCase.name, id]);
    const { openDialog } = useDialog();

    const {
        setSearch,
        filtered,
    } = useFilter(campaign?.coordinates || []);

    function openCreateDialog() {
        openDialog((props) => <CreateCampaignGeoCoordinateModal campaignId={campaign?.id as number} {...props} />);
    }

    function openUpdateDialog(_id: number) {
        openDialog((props) => (
            <UpdateCampaignGeoCoordinateModal
                campaignId={campaign?.id as number}
                id={_id}
                {...props}
            />
        ));
    }

    function openDeleteDialog(geoCoordinates: CampaignGeoCoordinateModel) {
        console.log(geoCoordinates);
        openDialog((props) => <DeleteCampaignGeoCoordinateModal geoCoordinates={geoCoordinates} {...props} />);
    }

    return (
        <Box>
            <Typography fontWeight={600}>
                Manage geo coordinates
            </Typography>

            <Row my={3}>
                <SearchField
                    autoCompleteRefs={filtered?.map((ip) => String(ip?.label))}
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
                    Create geo coordinate
                </Button>
            </Row>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell>Radius</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filtered.map((item): ReactElement => (
                            <TableRow key={item.id}>
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

                                <TableCell>{item.latitude}</TableCell>
                                <TableCell>{item.longitude}</TableCell>
                                <TableCell>{item.radius}</TableCell>

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
