import { Box, Column, Row } from 'presentation/components/layout';
import { colors, Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import Container from 'infrastructure/services/Container';
import { GetAdvertsStatisticsUseCase } from 'application/usecases/metrics/GetAdvertsStatisticsUseCase';
import { useDateContext, useQuery } from 'presentation/hooks';
import { CartesianGrid, Tooltip, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, TooltipProps } from 'recharts';
import { themePalette, touchTreeLogoPalette } from 'presentation/theme';
import url from 'utils/url';
import { useDownload } from 'presentation/hooks/useDownload';
import GetStatisticsUseCase from 'application/usecases/statistics/GetStatisticsUseCase';
import { StatisticsType } from 'domain/models/StatisticsModel';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import LoadingOverlay from 'presentation/components/LoadingOverlay';
import { Widget } from '../components/widgets/Widget';
import { IconButtonPaper, ButtonPaperItem } from '../components/buttons';

interface CustomTooltipProps extends TooltipProps<number, string> {
    barColor?: string;
}

/**
 * Custom tooltip for the adverts graph
 *
 * @param active
 * @param payload
 * @param label
 * @param barColor
 * @constructor
 */
function CustomTooltip({
    active,
    payload,
    label,
    barColor = touchTreeLogoPalette[2],
}: CustomTooltipProps) {
    if (!active || !payload || !payload.length) return null;

    const dataItem = payload[0].payload;

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
                {`Total clicks: ${dataItem.quantity}`}
            </Typography>
        </Box>
    );
}

/**
 * AdvertsGraph component
 *
 * @constructor
 */
export default function AdvertsGraph(): ReactElement {
    const getAdvertsStatisticsUseCase = Container.resolve(GetAdvertsStatisticsUseCase);
    const getStatisticsUseCase = Container.resolve(GetStatisticsUseCase);
    const { dateStart, dateFinal } = useDateContext();
    const { handleDownload } = useDownload();

    const { data: advertsData, isLoading } = useQuery(
        async () => getAdvertsStatisticsUseCase.handle({ dateStart, dateFinal }),
        [GetAdvertsStatisticsUseCase.name, dateStart, dateFinal],
    );

    async function onAdvertsDataDownload(): Promise<FileShape | null> {
        return getStatisticsUseCase.handle({ typeId: StatisticsType.HyperlinkClick, dateStart, dateFinal });
    }

    async function onDownload(): Promise<void> {
        await handleDownload(null, onAdvertsDataDownload);
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
                        Adverts
                    </Typography>
                </Row>

                <Box>
                    <IconButtonPaper>
                        <ButtonPaperItem label='Download' onClick={onDownload} />
                    </IconButtonPaper>
                </Box>
            </Row>

            <Row py={1}>
                <Column alignItems='center' gap={0}>
                    <Typography variant='body2'>
                        Total Clicks
                    </Typography>

                    <Typography fontSize={42} fontWeight={500}>
                        {advertsData?.totalClicks || 0}
                    </Typography>
                </Column>
            </Row>

            <Box height={300} position='relative' width='100%'>
                <ResponsiveContainer height={300} width='100%'>
                    <BarChart
                        data={advertsData?.clicks || []}
                        layout='vertical'
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                            allowDecimals={false}
                            dataKey='quantity'
                            type='number'
                        />
                        <YAxis
                            dataKey='url'
                            tickFormatter={(_url) => url.normalizeUrlForDisplay(_url)}
                            type='category'
                            width={100}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            barSize={30}
                            dataKey='quantity'
                            fill={touchTreeLogoPalette[2]}
                            name='Total clicks'
                        />
                    </BarChart>
                </ResponsiveContainer>

                <LoadingOverlay isLoading={isLoading} />
            </Box>
        </Widget>
    );
}
