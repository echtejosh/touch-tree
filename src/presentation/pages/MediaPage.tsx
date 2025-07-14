import React from 'react';

import { Box, Row } from 'presentation/components/layout';
import {
    Typography,
} from '@mui/material';
import { Tabs } from 'presentation/components/decorators';
import { useIntl } from 'react-intl';
import GamesPage from 'presentation/pages/media/GamesPage';
import PublicationsPage from 'presentation/pages/media/PublicationsPage';
import PodcastsPage from 'presentation/pages/media/PodcastsPage';

export default function MediaPage() {
    const { formatMessage } = useIntl();

    const pages = [
        {
            name: formatMessage({
                defaultMessage: 'Publications',
                id: 'media.label.publications',
            }),
            component: (<PublicationsPage />),
        },
        {
            name: formatMessage({
                defaultMessage: 'Games',
                id: 'media.label.games',
            }),
            component: (<GamesPage />),
        },
        {
            name: formatMessage({
                defaultMessage: 'Podcasts',
                id: 'media.label.podcasts',
            }),
            component: (<PodcastsPage />),
        },
    ];

    return (
        <Box>
            <Row
                alignItems='center'
                justifyContent='space-between'
                p={4}
                pb={0}
            >
                <Typography variant='h1'>
                    Media
                </Typography>
            </Row>

            <Box m={4} mt={2}>
                <Tabs
                    pages={pages}
                />
            </Box>
        </Box>
    );
}
