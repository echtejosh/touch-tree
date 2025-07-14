import { Box, Column, Row } from 'presentation/components/layout';
import { Typography } from '@mui/material';
import React, { ReactElement } from 'react';
import Container from 'infrastructure/services/Container';
import { useDateContext, useQuery } from 'presentation/hooks';
import { Tooltip, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { touchTreeLogoPalette } from 'presentation/theme';
import { GetCampaignsStatisticsUseCase } from 'application/usecases/metrics/GetCampaignsStatisticsUseCase';
import { useDownload } from 'presentation/hooks/useDownload';
import GetStatisticsUseCase from 'application/usecases/statistics/GetStatisticsUseCase';
import { StatisticsType } from 'domain/models/StatisticsModel';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import LoadingOverlay from 'presentation/components/LoadingOverlay';
import { Widget } from '../components/widgets/Widget';
import { IconButtonPaper, ButtonPaperItem } from '../components/buttons';

/**
 *
 * @constructor
 */
export default function CampaignsGraph(): ReactElement {
    const getCampaignsStatisticsUseCase = Container.resolve(GetCampaignsStatisticsUseCase);
    const getStatisticsUseCase = Container.resolve(GetStatisticsUseCase);
    const { dateStart, dateFinal } = useDateContext();
    const { handleDownload } = useDownload();

    const { data: campaignsData, isLoading } = useQuery(
        async () => getCampaignsStatisticsUseCase.handle({ dateStart, dateFinal }),
        [GetCampaignsStatisticsUseCase.name, dateStart, dateFinal],
    );

    const campaignLabels = Array.from(
        new Set(
            campaignsData?.campaigns?.flatMap((entry) => Object.keys(entry).filter((key) => key !== 'date'),
            ) || [],
        ),
    );

    async function onCampaignDataDownload(): Promise<FileShape | null> {
        return getStatisticsUseCase.handle({ typeId: StatisticsType.Visitor, dateStart, dateFinal });
    }

    async function onDownload(): Promise<void> {
        await handleDownload(null, onCampaignDataDownload);
    }

    return (
        <Widget sx={{ paddingLeft: 0, paddingBottom: 2 }}>
            <Row
                alignItems='center'
                gap={0}
                justifyContent='space-between'
                pl={3}
            >
                <Row gap={1}>
                    <Typography sx={{ fontWeight: 600 }} variant='h6'>
                        Campaigns
                    </Typography>
                </Row>

                <Box>
                    <IconButtonPaper>
                        <ButtonPaperItem label='Download' onClick={onDownload} />
                    </IconButtonPaper>
                </Box>
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
                        {campaignsData?.quantityNewRegistrants || 0}
                    </Typography>
                </Column>

                <Column alignItems='center' gap={0}>
                    <Typography variant='body2'>
                        Total Visitors
                    </Typography>

                    <Typography fontSize={42} fontWeight={500}>
                        {campaignsData?.quantityVisitors || 0}
                    </Typography>
                </Column>
            </Row>

            <Box height={300} position='relative' width='100%'>
                <ResponsiveContainer height={300} width='100%'>
                    <BarChart data={campaignsData?.campaigns || []}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        {/* <Legend */}
                        {/*     wrapperStyle={{ */}
                        {/*         paddingTop: 15, */}
                        {/*         paddingLeft: 24, */}
                        {/*         fontSize: 14, */}
                        {/*     }} */}
                        {/* /> */}
                        {campaignLabels.map((campaignLabel, index) => (
                            <Bar
                                key={campaignLabel}
                                dataKey={campaignLabel}
                                fill={touchTreeLogoPalette[index % touchTreeLogoPalette.length]}
                                name={campaignLabel}
                                stackId='stack'
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>

                <LoadingOverlay isLoading={isLoading} />
            </Box>
        </Widget>
    );
}
