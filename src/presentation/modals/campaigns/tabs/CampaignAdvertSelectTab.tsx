import useFilter from 'presentation/hooks/useFilter';
import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import { Box, Column, Row } from 'presentation/components/layout';

import {
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import React, { ReactElement, useEffect } from 'react';
import SearchField from 'presentation/components/form/fields/SearchField';
import { themePalette } from 'presentation/theme';
import GetAdvertsUseCase from 'application/usecases/adverts/GetAdvertsUseCase';
import useSelector from 'presentation/hooks/useSelector';
import Img from 'presentation/components/common/Img';

export interface CampaignAdvertSelectModalProps {
    ids: number[];

    onChange(ids: string[]): void;
}

export default function CampaignAdvertSelectTab({
    ids,
    onChange,
}: CampaignAdvertSelectModalProps) {
    const getAdvertsUseCase = Container.resolve(GetAdvertsUseCase);

    const { data: adverts } = useQuery(getAdvertsUseCase.handle, [GetAdvertsUseCase.name]);

    const {
        setSearch,
        filtered,
    } = useFilter(adverts || []);

    const {
        selected,
        isAllSelected,
        select,
        selectAll,
        deselectAll,
        setSelected,
    } = useSelector(filtered);

    useEffect(() => {
        onChange(selected);
    }, [selected]);

    useEffect(() => {
        setSelected(ids.map((item) => item?.toString()));
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Row mb={4}>
                <SearchField
                    autoCompleteRefs={adverts?.map((advert) => advert?.name?.toString())}
                    fullWidth
                    onChange={(value): void => setSearch(value, [
                        'id',
                        'name',
                    ])}
                    size='small'
                    sx={{ zIndex: 9999 }}
                />
            </Row>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding='checkbox'>
                                <Row alignItems='center' gap={0}>
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
                                </Row>
                            </TableCell>

                            <TableCell>Name</TableCell>
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
                                            height={40}
                                            src={item.image?.content as string}
                                            sx={{
                                                backgroundSize: 'cover',
                                                borderRadius: 1,
                                            }}
                                            width={40}
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
