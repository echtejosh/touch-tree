import { Box, Column, Row } from 'presentation/components/layout';
import React, { ReactElement, useEffect, useState } from 'react';
import date from 'utils/date';
import useFilter from 'presentation/hooks/useFilter';
import Container from 'infrastructure/services/Container';
import { useInvalidateQuery, useQuery } from 'presentation/hooks';
import GetPublicationsUseCase from 'application/usecases/publications/GetPublicationsUseCase';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SearchField from 'presentation/components/form/fields/SearchField';
import { MultipleSelect, MultipleSelectOption } from 'presentation/components/form/fields/MultipleSelect';
import Tags from 'presentation/components/tags/Tags';
import StatusTag from 'presentation/components/tags/StatusTag';
import { themePalette } from 'presentation/theme';
import DateService from 'infrastructure/services/locale/DateService';
import Tag from 'presentation/components/tags/Tag';
import useDialog from 'presentation/hooks/useDialog';
import str from 'utils/str';
import {
    EditIcon,
    FilterIcon, FormatShapesIcon,
    LockIcon,
    MoreVerticalIcon,
    UnlockIcon,
} from 'presentation/components/icons';
import { ButtonPaper, ButtonPaperItem, IconButtonPaper } from 'presentation/components/buttons';
import { ArticleModel } from 'domain/models/newsstand/NewsstandPublicationModel';
import Img from 'presentation/components/common/Img';
import ManagePublicationsModal from 'presentation/modals/newsstand/publications/ManagePublicationsModal';
import { DatePicker } from 'presentation/components/decorators';
import UpdateArticleUseCase from 'application/usecases/publications/UpdateArticleUseCase';
import UpdatePublicationPagesModal from 'presentation/modals/newsstand/publications/UpdatePublicationPagesModal';
import ManagePublicationInteractionsModal from 'presentation/modals/newsstand/publications/ManagePublicationInteractionsModal';
import { Override } from '../../../shared/types';

export default function NewsstandPublicationsPage() {
    const getPublicationsUseCase = Container.resolve(GetPublicationsUseCase);
    const updateArticleUseCase = Container.resolve(UpdateArticleUseCase);

    const dateService = Container.resolve(DateService);

    const { data: publications } = useQuery(getPublicationsUseCase.handle, [GetPublicationsUseCase.name]);
    const {
        openDialog,
        createDialog,
    } = useDialog();

    const [articles, setArticles] = useState<ArticleModel[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<MultipleSelectOption<string>[]>([]);
    const [selectedTags, setSelectedTags] = useState<MultipleSelectOption<string>[]>([]);

    const {
        setFilter,
        setSearch,
        filtered,
    } = useFilter(articles);

    const selectOptions = publications?.map((publication) => {
        return {
            value: publication.id.toString(),
            name: publication.name,
        };
    });

    async function updateArticle(values: Override<Partial<ArticleModel>, { id: number }>) {
        const result = await updateArticleUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetPublicationsUseCase.name]);
        }

        return result;
    }

    useEffect(() => {
        setFilter('status', ({ status }) => {
            const values = selectedStatuses.map((item) => item.value);

            if (!values.length) {
                return true;
            }

            return values.includes(status);
        });
    }, [selectedStatuses]);

    useEffect(() => {
        setFilter('tags', ({
            hasHtml,
            hasSpeech,
        }) => {
            const values = selectedTags.map((item) => item.value);

            if (!values.length) {
                return true;
            }

            return values.every((tag) => {
                if (tag === 'hasHtml') return hasHtml;
                if (tag === 'hasSpeech') return hasSpeech;
                return false;
            });
        });
    }, [selectedTags]);

    const handlePublication = (publicationIds: string[]) => {
        setFilter('publicationId', ({ publicationId }) => {
            if (!publicationIds.length) {
                return true;
            }

            return publicationIds.includes(publicationId.toString());
        });
    };

    function openManagePublicationDialog() {
        openDialog(() => <ManagePublicationsModal />);
    }

    function openUpdatePublicationPageModal(id: number, label: string) {
        const { open } = createDialog(() => <UpdatePublicationPagesModal id={id} label={label} />);

        open({ maxWidth: 'lg' });
    }

    function openManagePublicationInteractionsModal(id: number, label: string) {
        const { open } = createDialog(() => <ManagePublicationInteractionsModal id={id} label={label} />);

        open({ maxWidth: 'md' });
    }

    useEffect(() => {
        setArticles(publications?.flatMap((publication) => publication.articles) || []);
    }, [publications]);

    useEffect(() => {
        setFilter('date', ({ releaseDate }) => {
            if (!releaseDate || !startDate || !endDate) {
                return true;
            }

            return date.inRangeOf(releaseDate, startDate, endDate);
        });
    }, [startDate, endDate, setFilter]);

    return (
        <Box>
            <Row
                alignItems='center'
                justifyContent='space-between'
                p={4}
                pb={0}
            >
                <Typography variant='h1'>
                    Publications
                </Typography>
            </Row>

            <Box m={4}>
                <Column gap={4}>
                    <Row justifyContent='space-between'>
                        <Row width='60%'>
                            <SearchField
                                autoCompleteRefs={filtered.map((item) => item.name)}
                                onChange={(value): void => setSearch(value, [
                                    'id',
                                    'name',
                                    'publicationName',
                                    'releaseDate',
                                    'quantityPages',
                                    'status',
                                ])}
                                size='small'
                            />

                            <Box flex={1}>
                                <MultipleSelect
                                    label='Magazine'
                                    onChange={handlePublication}
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
                                <Box>
                                    <MultipleSelect
                                        label='Status'
                                        onChange={(_, values) => setSelectedStatuses(values)}
                                        options={[
                                            {
                                                value: 'live',
                                                name: 'Live',
                                            },
                                            {
                                                value: 'draft',
                                                name: 'Draft',
                                            },
                                        ]}
                                        size='small'
                                        value={selectedStatuses}
                                    />
                                </Box>
                                <Box>
                                    <MultipleSelect
                                        label='Tag'
                                        onChange={(_, values) => setSelectedTags(values)}
                                        options={[
                                            {
                                                value: 'hasHtml',
                                                name: 'Html',
                                            },
                                            {
                                                value: 'hasSpeech',
                                                name: 'Text to speech',
                                            },
                                        ]}
                                        size='small'
                                        value={selectedTags}
                                    />
                                </Box>
                            </ButtonPaper>

                            <Button
                                onClick={openManagePublicationDialog}
                                variant='contained'
                            >
                                Edit magazine description
                            </Button>
                        </Row>
                    </Row>

                    <Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id.</TableCell>

                                        <TableCell>Name</TableCell>
                                        <TableCell>Release date</TableCell>
                                        <TableCell>Pages</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Tags</TableCell>
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
                                                    <Img
                                                        height={90}
                                                        src={item.imageThumb as string}
                                                        sx={{
                                                            backgroundSize: 'cover',
                                                            borderRadius: 1,
                                                        }}
                                                        width={65}
                                                    />

                                                    <Column gap={0}>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 500,
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                            }}
                                                        >
                                                            {item.publicationName}
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
                                                            {item.name}
                                                        </Typography>
                                                    </Column>
                                                </Row>
                                            </TableCell>

                                            <TableCell>
                                                <Typography>
                                                    {item.releaseDate ? dateService.format(item.releaseDate) : String()}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography>
                                                    {item.quantityPages}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Tags>
                                                    <StatusTag
                                                        label={str.capitalize(item.status)}
                                                        status={item.status}
                                                        sx={{ background: themePalette.border.light }}
                                                    />
                                                </Tags>
                                            </TableCell>

                                            <TableCell>
                                                <Tags>
                                                    {item.hasHtml && (
                                                        <Tag label='Html' />
                                                    )}
                                                    {item.hasSpeech && (
                                                        <Tag label='Text to speech' />
                                                    )}
                                                </Tags>
                                            </TableCell>

                                            <TableCell align='right'>
                                                <IconButtonPaper icon={<MoreVerticalIcon />}>
                                                    <ButtonPaperItem
                                                        icon={item.isLocked ? <UnlockIcon /> : <LockIcon />}
                                                        label={item.isLocked ? 'Unlock' : 'Lock'}
                                                        onClick={() => updateArticle({
                                                            id: item.id,
                                                            isLocked: !item.isLocked,
                                                        })}
                                                    />

                                                    <ButtonPaperItem
                                                        icon={<EditIcon />}
                                                        label='Edit HTML'
                                                        onClick={() => openUpdatePublicationPageModal(item.id, item.fullName)}
                                                        sx={{ display: item.hasHtml ? 'flex' : 'none' }}
                                                    />

                                                    <ButtonPaperItem
                                                        icon={<FormatShapesIcon />}
                                                        label='Manage interactions'
                                                        onClick={() => openManagePublicationInteractionsModal(item.id, item.fullName)}
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
