import { Box, Column, Row } from 'presentation/components/layout';
import { colors, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import Container from 'infrastructure/services/Container';
import { GetPagesUseCase } from 'application/usecases/metrics/GetPagesUseCase';
import { useDateContext, useQuery } from 'presentation/hooks';
import { CartesianGrid, Tooltip, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, TooltipProps } from 'recharts';
import { themePalette, touchTreeLogoPalette } from 'presentation/theme';
import { PopularPageEntry } from 'domain/models/MetricsModel';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import { useDownload } from 'presentation/hooks/useDownload';
import GetStatisticsUseCase from 'application/usecases/statistics/GetStatisticsUseCase';
import { StatisticsType } from 'domain/models/StatisticsModel';
import LoadingOverlay from 'presentation/components/LoadingOverlay';
import { formatMinutesShort } from 'presentation/utils/formatMinutesShort';
import { Widget } from '../components/widgets/Widget';
import { IconButtonPaper, ButtonPaperItem } from '../components/buttons';

interface CustomTooltipProps extends TooltipProps<number, string> {
    barColor?: string;
}

/**
 *
 * @param active
 * @param payload
 * @param label
 * @param pages
 * @constructor
 */
function CustomTooltip({
    active,
    payload,
    label,
    barColor = touchTreeLogoPalette[0],
}: CustomTooltipProps) {
    if (!active || !payload || !payload.length) return null;

    const dataItem = payload[0].payload as PopularPageEntry;

    // const index = pages?.popularPages
    //     ?.findIndex((p) => p.articleId === dataItem.articleId && p.pageNumber === dataItem.pageNumber) || 0;
    // const barColor = touchTreeLogoPalette[index];

    return (
        <Box sx={{
            p: 1.3,
            background: colors.common.white,
            border: `1px solid ${themePalette.border.main}`,
            borderRadius: 1,
        }}
        >
            <Typography>
                {label}
            </Typography>
            <Typography
                sx={{ color: barColor }}
            >
                {`Total: ${formatMinutesShort(dataItem.minutes)}`}
            </Typography>
        </Box>
    );
}

/**
 *
 * @constructor
 */
export default function PagesGraph(): ReactElement {
    const getPagesUseCase = Container.resolve(GetPagesUseCase);
    const getStatisticsUseCase = Container.resolve(GetStatisticsUseCase);

    const { dateStart, dateFinal } = useDateContext();
    const { handleDownload } = useDownload();

    const { data: pagesData, isLoading } = useQuery(
        async () => getPagesUseCase.handle({ dateStart, dateFinal }),
        [GetPagesUseCase.name, dateStart, dateFinal],
    );

    async function onPagesDataDownload(): Promise<FileShape | null> {
        return getStatisticsUseCase.handle({ typeId: StatisticsType.Publication, dateStart, dateFinal });
    }

    async function onDownload(): Promise<void> {
        await handleDownload(null, onPagesDataDownload);
    }

    return (
        <Widget sx={{ paddingBottom: 2 }}>
            <Row
                alignItems='center'
                gap={0}
                justifyContent='space-between'
            >
                <Row gap={1}>
                    <Typography sx={{ fontWeight: 600 }} variant='h6'>
                        Publications
                    </Typography>

                    {/* <TooltipIcon */}
                    {/*     placement='right' */}
                    {/*     text='This graph shows the most popular page for each publication and the average time spent on it (in minutes).' */}
                    {/* /> */}
                </Row>

                <Box>
                    <IconButtonPaper>
                        <ButtonPaperItem label='Download' onClick={onDownload} />
                    </IconButtonPaper>
                </Box>
            </Row>

            <Row py={1}>
                <Column alignItems='center' gap={0}>
                    <Typography alignSelf='flex-start' variant='body2'>
                        Total Time
                    </Typography>

                    <Typography fontSize={42} fontWeight={500}>
                        {formatMinutesShort(pagesData?.totalMinutes || 0)}
                    </Typography>
                </Column>
            </Row>

            <Box height={300} position='relative' width='100%'>
                <ResponsiveContainer height={300} width='100%'>
                    <BarChart
                        data={pagesData?.popularPages || []}
                        layout='vertical'
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                            allowDecimals={false}
                            dataKey='minutes'
                            type='number'
                        />
                        <YAxis
                            dataKey='fullName'
                            type='category'
                            width={100}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            barSize={30}
                            dataKey='minutes'
                            fill={touchTreeLogoPalette[0]}
                            name='Total minutes'
                        />
                    </BarChart>
                </ResponsiveContainer>

                <LoadingOverlay isLoading={isLoading} />
            </Box>
        </Widget>
    );
}
