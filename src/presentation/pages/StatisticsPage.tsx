import React, { ReactElement } from 'react';
import Container from 'infrastructure/services/Container';
import { Box, Column } from 'presentation/components/layout';
import FormLabel from 'presentation/components/form/FormLabel';
import GetStatisticsUseCase from 'application/usecases/statistics/GetStatisticsUseCase';
import DownloadButton from 'presentation/components/buttons/DownloadButton';
import { Typography } from '@mui/material';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import { StatisticsType } from 'domain/models/StatisticsModel';

export default function StatisticsPage(): ReactElement {
    const getStatisticsUseCase = Container.resolve(GetStatisticsUseCase);

    async function onRowDataDownload(): Promise<FileShape | null> {
        return getStatisticsUseCase.handle({ typeId: StatisticsType.Raw });
    }

    async function onPublicationDataDownload(): Promise<FileShape | null> {
        return getStatisticsUseCase.handle({ typeId: StatisticsType.Publication });
    }

    async function onVisitorDataDownload(): Promise<FileShape | null> {
        return getStatisticsUseCase.handle({ typeId: StatisticsType.Visitor });
    }

    async function onHyperlinkClickDataDownload(): Promise<FileShape | null> {
        return getStatisticsUseCase.handle({ typeId: StatisticsType.HyperlinkClick });
    }

    return (
        <Box>
            <Box
                p={4}
                pb={0}
            >
                <Typography variant='h1'>
                    Statistics
                </Typography>
            </Box>

            <Column gap={1} m={4} maxWidth={600}>
                <Column columns={2}>
                    <FormLabel id='statistics.download.raw-data' />

                    <DownloadButton
                        label='Download'
                        onDownloadClick={onRowDataDownload}
                        variant='outlined'
                    />
                </Column>

                <Column columns={2}>
                    <FormLabel id='statistics.download.publication-data' />

                    <DownloadButton
                        label='Download'
                        onDownloadClick={onPublicationDataDownload}
                        variant='outlined'
                    />
                </Column>

                <Column columns={2}>
                    <FormLabel id='statistics.download.visitor-data' />

                    <DownloadButton
                        label='Download'
                        onDownloadClick={onVisitorDataDownload}
                        variant='outlined'
                    />
                </Column>

                <Column columns={2}>
                    <FormLabel id='statistics.download.hyperlink-click-data' />

                    <DownloadButton
                        label='Download'
                        onDownloadClick={onHyperlinkClickDataDownload}
                        variant='outlined'
                    />
                </Column>
            </Column>
        </Box>
    );
}
