import useFilter from 'presentation/hooks/useFilter';
import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import { Box, Row } from 'presentation/components/layout';

import {
    Button,
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
import { ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import useDialog from 'presentation/hooks/useDialog';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import UpdateSupplementCategoryModal from 'presentation/modals/newsstand/supplements/UpdateSupplementCategoryModal';
import CreateSupplementCategoryModal from 'presentation/modals/newsstand/supplements/CreateSupplementCategoryModal';
import RemoveSupplementsCategoryModal from 'presentation/modals/newsstand/supplements/RemoveSupplementsCategoryModal';
import { CategoryModel } from 'domain/models/newsstand/NewsstandSupplementModel';

export default function ManageSupplementCategoriesModal() {
    const getSupplementsUseCase = Container.resolve(GetSupplementsUseCase);

    const { data: supplements } = useQuery(getSupplementsUseCase.handle, [GetSupplementsUseCase.name]);
    const { openDialog } = useDialog();

    const {
        setSearch,
        filtered,
    } = useFilter(supplements?.categories || []);

    const refs = filtered.map((item) => item.label.toString());

    const findCategoriesToUpdate = (id: number) => {
        const category = supplements?.categories?.find((pub) => pub.id === id);

        if (!category) {
            return null;
        }

        return {
            id: category.id,
            label: category.label,
        };
    };

    const openUpdateDialog = (id: number) => {
        const category = findCategoriesToUpdate(id);

        if (!category) {
            return;
        }

        openDialog((props) => <UpdateSupplementCategoryModal category={category} {...props} />);
    };

    const openDeleteDialog = (category: CategoryModel) => {
        openDialog((props) => <RemoveSupplementsCategoryModal category={category} {...props} />);
    };

    function openCreateDialog() {
        openDialog((props) => <CreateSupplementCategoryModal {...props} />);
    }

    return (
        <Box p={4}>
            <Typography variant='h2'>
                Edit a category
            </Typography>

            <Row my={4}>
                <SearchField
                    autoCompleteRefs={refs}
                    fullWidth
                    onChange={(value): void => setSearch(value, [
                        'label',
                        'id',
                    ])}
                    size='small'
                    sx={{ zIndex: 9999 }}
                />

                <Button onClick={openCreateDialog} variant='contained'>Add category</Button>
            </Row>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align='right'>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filtered.map((item): ReactElement => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Typography sx={{ fontWeight: 500 }}>
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
                                </TableCell>

                                <TableCell align='right'>
                                    <IconButtonPaper zIndex={9999}>
                                        <ButtonPaperItem
                                            label='Edit'
                                            onClick={() => openUpdateDialog(item.id)}
                                        />
                                        <ButtonPaperItem
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
