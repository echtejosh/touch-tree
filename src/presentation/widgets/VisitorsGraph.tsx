import React, { ReactElement } from 'react';
import { Column, Row } from 'presentation/components/layout';
import { IconButtonPaper, ButtonPaperItem } from 'presentation/components/buttons';
import { Typography, Box } from '@mui/material';
import { useDateContext, useQuery } from 'presentation/hooks';
import Container from 'infrastructure/services/Container';
import { GetVisitorsUseCase } from 'application/usecases/metrics/GetVisitorsUseCase';
import { CartesianGrid, Tooltip, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { touchTreeLogoPalette } from 'presentation/theme';
import GetStatisticsUseCase from 'application/usecases/statistics/GetStatisticsUseCase';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import { useDownload } from 'presentation/hooks/useDownload';
import { StatisticsType } from 'domain/models/StatisticsModel';
import LoadingOverlay from 'presentation/components/LoadingOverlay';
import { Widget } from '../components/widgets/Widget';

/**
 *
 * @constructor
 */
export default function VisitorsGraph(): ReactElement {
    const getVisitorsUseCase = Container.resolve(GetVisitorsUseCase);
    const getStatisticsUseCase = Container.resolve(GetStatisticsUseCase);
    const { dateStart, dateFinal } = useDateContext();
    const { handleDownload } = useDownload();

    const { data: visitorsData, isLoading } = useQuery(
        async () => getVisitorsUseCase.handle({ dateStart, dateFinal }),
        [GetVisitorsUseCase.name, dateStart, dateFinal],
    );

    async function onVisitorDataDownload(): Promise<FileShape | null> {
        return getStatisticsUseCase.handle({ typeId: StatisticsType.Visitor, dateStart, dateFinal });
    }

    async function onDownload(): Promise<void> {
        await handleDownload(null, onVisitorDataDownload);
    }

    return (
        <Widget sx={{ paddingLeft: 0, paddingBottom: 2 }}>
            <Row
                alignItems='center'
                gap={0}
                justifyContent='space-between'
                pl={3}
            >
                <Typography sx={{ fontWeight: 600 }} variant='h6'>
                    Visitors
                </Typography>

                <IconButtonPaper>
                    <ButtonPaperItem label='Download' onClick={onDownload} />
                </IconButtonPaper>
            </Row>

            <Row
                alignItems='center'
                gap={4}
                p={3}
                py={1}
            >
                <Column alignItems='center' gap={0}>
                    <Typography variant='body2'>
                        New Registrations
                    </Typography>

                    <Typography fontSize={42} fontWeight={500}>
                        {visitorsData?.quantityNewRegistrants || 0}
                    </Typography>
                </Column>

                <Column alignItems='center' gap={0} sx={{ color: touchTreeLogoPalette[3] }}>
                    <Typography variant='body2'>
                        Total Visitors
                    </Typography>

                    <Typography fontSize={42} fontWeight={500}>
                        {visitorsData?.quantityVisitors || 0}
                    </Typography>
                </Column>
            </Row>

            <Box height={300} position='relative' width='100%'>
                <ResponsiveContainer height={300} width='100%'>
                    <BarChart
                        data={visitorsData?.visitors || []}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar
                            barSize={28}
                            dataKey='visitors'
                            fill={touchTreeLogoPalette[3]}
                            name='Total'
                        />
                    </BarChart>
                </ResponsiveContainer>

                <LoadingOverlay isLoading={isLoading} />
            </Box>
        </Widget>
    );
}
