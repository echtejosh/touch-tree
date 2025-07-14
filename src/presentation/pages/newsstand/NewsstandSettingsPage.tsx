import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import SettingsSettingsTab from 'presentation/pages/newsstand/settings/tabs/SettingsSettingsTab';
import { Box, Row } from 'presentation/components/layout';
import { Typography } from '@mui/material';
import SettingsRegistrationsTab from 'presentation/pages/newsstand/settings/tabs/SettingsRegistrationsTab';
import { Tabs } from 'presentation/components/decorators';
import SettingsSubscriberTab from 'presentation/pages/newsstand/settings/tabs/SettingsSubscriberTab';
import { getCurrentTheme } from 'presentation/themes/themeSelect';
import NewsstandCoordinatesPage from 'presentation/pages/newsstand/coordinates/NewsstandCoordinatesPage';
import NewsstandIpAddressesPage from 'presentation/pages/newsstand/ipAddress/NewsstandIpAddressesPage';

interface TabPage {
    name: string;
    component: ReactNode;
}

export default function NewsstandSettingsPage() {
    const { formatMessage } = useIntl();
    const theme = getCurrentTheme();

    let pages: TabPage[];

    if (!theme.subset) {
        pages = [
            {
                name: formatMessage({
                    defaultMessage: 'Settings',
                    id: 'newsstand.settings',
                }),
                component: (<SettingsSettingsTab />),
            },
            {
                name: formatMessage({
                    defaultMessage: 'Subscriber and user data',
                    id: 'newsstand.subscriber',
                }),
                component: (<SettingsSubscriberTab />),
            },
            {
                name: formatMessage({
                    defaultMessage: 'New registrations',
                    id: 'newsstand.registrations',
                }),
                component: (<SettingsRegistrationsTab />),
            },
        ];
    } else {
        pages = [
            {
                name: formatMessage({
                    defaultMessage: 'Geo-coordinates',
                    id: 'newsstand.settings',
                }),
                component: (<NewsstandCoordinatesPage />),
            },
            {
                name: formatMessage({
                    defaultMessage: 'IP addresses',
                    id: 'newsstand.settings',
                }),
                component: (<NewsstandIpAddressesPage />),
            },
        ];
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
                    Platform
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
