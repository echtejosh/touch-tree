import { Box, Column, Row } from 'presentation/components/layout';
import React, { ReactElement, useEffect, useState } from 'react';
import date from 'utils/date';
import useFilter from 'presentation/hooks/useFilter';
import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import {
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
import { MultipleSelect } from 'presentation/components/form/fields/MultipleSelect';
import { themePalette } from 'presentation/theme';
import DateService from 'infrastructure/services/locale/DateService';
import { AddIcon, DeleteIcon, EditIcon, FilterIcon, MoreVerticalIcon } from 'presentation/components/icons';
import { ButtonPaper, ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import useDialog from 'presentation/hooks/useDialog';
import CreateSupplementDocumentModal from 'presentation/modals/newsstand/supplements/CreateSupplementDocumentModal';
import UpdateSupplementDocumentModal from 'presentation/modals/newsstand/supplements/UpdateSupplementDocumentModal';
import { DocumentModel } from 'domain/models/newsstand/NewsstandSupplementModel';
import DeleteSupplementDocumentModal from 'presentation/modals/newsstand/supplements/DeleteSupplementDocumentModal';
import ManageSupplementCategoriesModal from 'presentation/modals/newsstand/supplements/ManageSupplementCategoriesModal';
import { DatePicker } from 'presentation/components/decorators';
import ButtonIcon from '../../components/buttons/ButtonIcon';

export default function NewsstandSupplementsPage() {
    const getSupplementsUseCase = Container.resolve(GetSupplementsUseCase);
    const dateService = Container.resolve(DateService);

    const { openDialog } = useDialog();

    const { data: supplements } = useQuery(getSupplementsUseCase.handle, [GetSupplementsUseCase.name]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const {
        setFilter,
        setSearch,
        filtered,
    } = useFilter(supplements?.documents || []);

    const selectOptions = supplements?.categories.map((category) => {
        return {
            value: category.id.toString(),
            name: category.label,
        };
    });

    useEffect(() => {
        setFilter('date', ({ dateCreated }) => {
            if (!dateCreated || !startDate || !endDate) {
                return true;
            }

            return date.inRangeOf(dateCreated, startDate, endDate);
        });
    }, [startDate, endDate, setFilter]);

    function openCreateDialog() {
        openDialog((props) => <CreateSupplementDocumentModal {...props} />);
    }

    function openManageCategoriesDialog() {
        openDialog(() => <ManageSupplementCategoriesModal />);
    }

    function openUpdateDocumentDialog(document: DocumentModel) {
        openDialog((props) => (
            <UpdateSupplementDocumentModal
                document={{
                    id: document.id,
                    label: document.name,
                    categoryId: document.categoryId,
                }}
                {...props}
            />
        ));
    }

    function openDeleteDocumentDialog(document: DocumentModel) {
        openDialog((props) => <DeleteSupplementDocumentModal document={document} {...props} />);
    }

    return (
        <Box>
            <Row
                alignItems='center'
                justifyContent='space-between'
                p={4}
                pb={0}
            >
                <Typography variant='h1'>
                    Supplements
                </Typography>
            </Row>

            <Box m={4}>
                <Column gap={4}>
                    <Row justifyContent='space-between'>
                        <Row width={600}>
                            <SearchField
                                autoCompleteRefs={filtered.map((item) => item.name)}
                                onChange={(value): void => setSearch(value, [
                                    'id',
                                    'name',
                                    'name',
                                    'categoryLabel',
                                ])}
                                size='small'
                            />

                            <Box flex={1}>
                                <MultipleSelect
                                    label='Categories'
                                    options={selectOptions || []}
                                    size='small'
                                />
                            </Box>
                        </Row>

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
                            </ButtonPaper>

                            <ButtonIcon onClick={openManageCategoriesDialog} variant='outlined'>
                                Edit a category
                            </ButtonIcon>

                            <ButtonIcon icon={<AddIcon />} onClick={openCreateDialog}>
                                Add document
                            </ButtonIcon>
                        </Row>
                    </Row>

                    <Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id.</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Date added</TableCell>
                                        <TableCell>Pages</TableCell>
                                        <TableCell align='right'>Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filtered.map((item): ReactElement => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Typography>
                                                    {item.id}
                                                </Typography>
                                            </TableCell>

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
                                                            {item.categoryLabel}
                                                        </Typography>
                                                    </Column>
                                                </Row>
                                            </TableCell>

                                            <TableCell>
                                                <Typography>
                                                    {item.dateCreated ? dateService.format(item.dateCreated) : String()}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography>
                                                    {item.pages}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align='right'>
                                                <IconButtonPaper icon={<MoreVerticalIcon />}>
                                                    <ButtonPaperItem
                                                        icon={<EditIcon />}
                                                        label='Edit'
                                                        onClick={(): void => openUpdateDocumentDialog(item)}
                                                    />

                                                    <ButtonPaperItem
                                                        icon={<DeleteIcon />}
                                                        label='Delete'
                                                        onClick={() => openDeleteDocumentDialog(item)}
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
        </Box>
    );
}
