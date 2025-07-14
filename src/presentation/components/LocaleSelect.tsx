import { useIntl } from 'presentation/hooks';
import { Box } from 'presentation/components/layout';
import React from 'react';
import flags from 'country-flag-icons/react/3x2';
import { MenuItem, Select } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import Container from 'infrastructure/services/Container';
import LocaleService from 'infrastructure/services/locale/LocaleService';

export default function LocaleSelect() {
    const localeService = Container.resolve(LocaleService);

    const { setLocale } = useIntl();

    function handleChange(value: string): void {
        setLocale(value);
    }

    return (
        <Select
            onChange={(event): void => handleChange(event.target.value)}
            value={localeService.getLocale()}
            variant='outlined'
        >
            <MenuItem value='en-gb'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <flags.GB
                        style={{
                            width: '24px',
                            borderRadius: 2,
                        }}
                    />
                    <FormattedMessage
                        defaultMessage='English, UK'
                        id='label.locale.en-gb'
                    />
                </Box>
            </MenuItem>

            <MenuItem value='en-us'>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <flags.US
                        style={{
                            width: '24px',
                            borderRadius: 2,
                        }}
                    />
                    <FormattedMessage
                        defaultMessage='English, US'
                        id='label.locale.en-us'
                    />
                </Box>
            </MenuItem>
        </Select>
    );
}
