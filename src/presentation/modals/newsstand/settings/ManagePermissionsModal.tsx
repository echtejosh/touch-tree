import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Paper, Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Column, Row } from 'presentation/components/layout';
import { themePalette } from 'presentation/theme';
import useFilter from 'presentation/hooks/useFilter';
import Container from 'infrastructure/services/Container';
import GetEmailAccessFilesUseCase from 'application/usecases/newsstand/settings/GetEmailAccessFilesUseCase';
import { useInvalidateQuery, useQuery } from 'presentation/hooks';
import GetEmailAccessFileUseCase from 'application/usecases/newsstand/settings/GetEmailAccessFileUseCase';
import SearchField from 'presentation/components/form/fields/SearchField';
import { DatePicker } from '@mui/x-date-pickers';
import UploadEmailsAccessFileUseCase from 'application/usecases/newsstand/settings/UploadEmailsAccessFileUseCase';
import FileUploadSelect from 'presentation/components/form/buttons/FileUploadSelect';
import date from 'utils/date';
import StatusTag from 'presentation/components/tags/StatusTag';
import Tags from 'presentation/components/tags/Tags';
import DateService from 'infrastructure/services/locale/DateService';
import { EmailAccessFileModel } from 'domain/models/newsstand/NewsstandSettingsModel';
import Tag from 'presentation/components/tags/Tag';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import DownloadButton from 'presentation/components/buttons/DownloadButton';

export default function ManagePermissionsModal() {
    const getEmailAccessFilesUseCase = Container.resolve(GetEmailAccessFilesUseCase);
    const getEmailAccessFileUseCase = Container.resolve(GetEmailAccessFileUseCase);
    const uploadEmailsAccessFileUseCase = Container.resolve(UploadEmailsAccessFileUseCase);

    const dateService = Container.resolve(DateService);

    const { data: emailAccessFiles } = useQuery(getEmailAccessFilesUseCase.handle, [GetEmailAccessFilesUseCase.name]);
    const { data: emailAccessFile } = useQuery(
        getEmailAccessFileUseCase.handle,
        [GetEmailAccessFileUseCase.name]);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const {
        setFilter,
        setSearch,
        filtered,
    } = useFilter(emailAccessFiles || []);

    const latestUpload = useMemo(
        () => emailAccessFiles?.reduce<EmailAccessFileModel | null>((latest, upload) => (
            !latest || (upload.date && latest.date && upload.date.getTime() > latest.date.getTime()) ? upload : latest
        ), null),
        [emailAccessFiles],
    );

    async function onUpload(fileData: FileShape) {
        console.log(fileData);
        const result = await uploadEmailsAccessFileUseCase.handle(fileData);

        if (result) {
            useInvalidateQuery([GetEmailAccessFilesUseCase.name]);
        }

        return result;
    }

    useEffect(() => {
        setFilter('date', ({
            date: uploadDate,
        }) => {
            console.log(startDate);
            if (!uploadDate || !startDate || !endDate) {
                return true;
            }

            return date.inRangeOf(uploadDate, startDate, endDate);
        });
    }, [startDate, endDate]);

    return (
        <Box m={4}>
            <Typography
                sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    mb: 3,
                }}
            >
                Manage who can view this newsstand
            </Typography>

            <Column>
                <Row
                    sx={{
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Typography>Supported emails spreadsheet for import are:</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.5,
                        }}
                    >
                        <Tag label='.csv' />
                        <Tag label='.xlsx' />
                    </Box>
                </Row>
                <Column>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {
                                xs: 'column',
                                sm: 'row',
                            },
                            gap: 3,
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <SearchField
                                autoCompleteRefs={filtered.map((item) => item.fileName || String())}
                                onChange={(value): void => setSearch(value, [
                                    'date',
                                    'fileName',
                                    'recordCount',
                                ])}
                                size='small'
                            />
                        </Box>
                        <Box flex={0.8}>
                            <DatePicker
                                format='MMMM d yyyy'
                                label='From'
                                onChange={(value) => setStartDate(value)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                    },
                                }}
                                value={startDate}
                            />
                        </Box>

                        <Box flex={0.8}>
                            <DatePicker
                                format='MMMM d yyyy'
                                label='To'
                                onChange={(value) => setEndDate(value)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                    },
                                }}
                                value={endDate}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date uploaded</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Number of records</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filtered.slice(0, 5).map((item): ReactElement => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Typography>
                                                    {item.date ? dateService.format(item.date) : String()}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography>
                                                    {item.fileName}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography>
                                                    {item.recordCount}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                {item.id === latestUpload?.id && (
                                                    <Tags>
                                                        <StatusTag
                                                            label='Live'
                                                            status='live'
                                                            sx={{ background: themePalette.border.light }}
                                                        />
                                                    </Tags>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Column>

                <Row
                    sx={{
                        gap: 3,
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        justifyContent: 'end',
                    }}
                >
                    <Box>
                        <DownloadButton
                            file={emailAccessFile}
                            label='Export as .xlsx'
                            variant='outlined'
                        />
                    </Box>
                    <Box>
                        <FileUploadSelect
                            data={{
                                accepts: ['.xlsx', '.csv'],
                                maxSizeInMb: 10,
                                mimeTypes: [
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    'text/csv',
                                ],
                            }}
                            label='Import emails'
                            name='emailAccessFile'
                            onSelect={onUpload}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                </Row>
            </Column>
        </Box>
    );
}
