import React from 'react';
import { Box, Column } from 'presentation/components/layout';
import LocaleSelect from 'presentation/components/LocaleSelect';
import { Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function SettingsLanguageTab() {
    return (
        <Column>
            <Typography fontWeight={600}>
                <FormattedMessage id='settings.language.title' />
            </Typography>

            <Box>
                <LocaleSelect />
            </Box>
        </Column>
    );
}
