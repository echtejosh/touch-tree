import useFilter from 'presentation/hooks/useFilter';
import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import { Box, Row } from 'presentation/components/layout';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import React, { ReactElement } from 'react';
import SearchField from 'presentation/components/form/fields/SearchField';
import { themePalette } from 'presentation/theme';
import GetPublicationsUseCase from 'application/usecases/publications/GetPublicationsUseCase';
import { ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import UpdatePublicationDescriptionModal from 'presentation/modals/newsstand/publications/UpdatePublicationDescriptionModal';
import useDialog from 'presentation/hooks/useDialog';

export default function ManagePublicationsModal() {
    const getPublicationsUseCase = Container.resolve(GetPublicationsUseCase);

    const { data: publications } = useQuery(getPublicationsUseCase.handle, [GetPublicationsUseCase.name]);
    const { openDialog } = useDialog();

    const {
        setSearch,
        filtered,
    } = useFilter(publications || []);

    const refs = filtered.map((item) => item.name.toString());

    const findPublicationToUpdate = (id: number) => {
        const publication = publications?.find((pub) => pub.id === id);

        if (!publication) {
            return null;
        }

        return {
            id: publication.id,
            name: publication.name,
            description: publication.description,
        };
    };

    const onPublicationEdit = (id:number) => {
        const publicationToUpdate = findPublicationToUpdate(id);

        if (!publicationToUpdate) {
            return;
        }

        openDialog(() => (
            <UpdatePublicationDescriptionModal publication={publicationToUpdate} />
        ));
    };

    return (
        <Box p={4}>
            <Typography variant='h2'>
                Edit magazine description
            </Typography>

            <Row my={4}>
                <SearchField
                    autoCompleteRefs={refs}
                    fullWidth
                    onChange={(value): void => setSearch(value, [
                        'name',
                        'id',
                    ])}
                    size='small'
                    sx={{ zIndex: 9999 }}
                />
            </Row>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filtered.map((item): ReactElement => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Typography sx={{ fontWeight: 500 }}>
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
                                </TableCell>

                                <TableCell align='right'>
                                    <IconButtonPaper zIndex={9999}>
                                        <ButtonPaperItem
                                            label='Edit'
                                            onClick={() => onPublicationEdit(item.id)}
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
