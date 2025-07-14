import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import useDialog from 'presentation/hooks/useDialog';
import useFilter from 'presentation/hooks/useFilter';
import { Box, Column, Row } from 'presentation/components/layout';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SearchField from 'presentation/components/form/fields/SearchField';
import React, { ReactElement } from 'react';
import { themePalette } from 'presentation/theme';
import { ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import { DeleteIcon, EditIcon, MoreVerticalIcon } from 'presentation/components/icons';
import GetRelationGeoCoordinatesUseCase from 'application/usecases/newsstand/relation/coordinates/GetRelationGeoCoordinatesUseCase';
import UpdateRelationGeoCoordinateModal from 'presentation/modals/newsstand/relation/geocoordinate/UpdateRelationGeoCoordinateModal';
import DeleteRelationGeoCoordinateModal from 'presentation/modals/newsstand/relation/geocoordinate/DeleteRelationGeoCoordinateModal';
import CreateRelationGeoCoordinateModal from 'presentation/modals/newsstand/relation/geocoordinate/CreateRelationGeoCoordinateModal';

export default function NewsstandCoordinatesPage() {
    const getRelationGeoCoordinatesUseCase = Container.resolve(GetRelationGeoCoordinatesUseCase);

    const { data: relationCoordinates, isLoading } = useQuery(() => getRelationGeoCoordinatesUseCase.handle(), [GetRelationGeoCoordinatesUseCase.name]);
    const { openDialog } = useDialog();

    const {
        setSearch,
        filtered,
    } = useFilter(relationCoordinates || []);

    const shouldShowCreateButton = !isLoading && (relationCoordinates?.length || 0) < 1;

    // For Jason's request
    function openCreateDialog() {
        openDialog((props) => <CreateRelationGeoCoordinateModal {...props} />);
    }

    function openUpdateDialog(id: number) {
        console.log(id);
        openDialog((props) => <UpdateRelationGeoCoordinateModal id={id} {...props} />);
    }

    function openDeleteDialog(id: number) {
        openDialog((props) => <DeleteRelationGeoCoordinateModal id={id} {...props} />);
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

                {/* For Jason's request */}
                {shouldShowCreateButton && (
                    <Button
                        onClick={openCreateDialog}
                        variant='contained'
                    >
                        Create geo coordinate
                    </Button>
                )}
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
                                            onClick={() => openDeleteDialog(item.id)}
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
