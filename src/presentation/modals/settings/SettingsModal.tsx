import React from 'react';
import { Tabs } from 'presentation/components/decorators';
import { Box } from 'presentation/components/layout';
import { useIntl } from 'presentation/hooks';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@mui/material';
import SettingsAccountTab from 'presentation/modals/settings/tabs/SettingsAccountTab';
import SettingsLanguageTab from 'presentation/modals/settings/tabs/SettingsLanguageTab';
import SettingsPasswordTab from 'presentation/modals/settings/tabs/SettingsPasswordTab';

export default function SettingsModal() {
    const { formatMessage } = useIntl();

    return (
        <Box p={4}>
            <Typography variant='h2'>
                <FormattedMessage id='modals.settings.title' />
            </Typography>

            <Box mt={1}>
                <Tabs
                    pages={[
                        {
                            name: formatMessage({ id: 'settings.account' }),
                            component: (<SettingsAccountTab />),
                        },
                        {
                            name: formatMessage({ id: 'settings.language' }),
                            component: (<SettingsLanguageTab />),
                        },
                        {
                            name: formatMessage({ id: 'settings.password' }),
                            component: (<SettingsPasswordTab />),
                        },
                    ]}
                />
            </Box>
        </Box>
    );
}
