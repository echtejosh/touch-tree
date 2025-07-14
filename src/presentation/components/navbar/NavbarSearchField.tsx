import React, { ReactElement } from 'react';
import { SearchIcon } from 'presentation/components/icons';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonProps } from '@mui/material';

export default function NavbarSearchField({
    sx,
    ...props
}: ButtonProps): ReactElement {
    return (
        <Button
            fullWidth
            size='large'
            sx={{
                background: 'rgba(255,255,255,0.04)',
                gap: 2,

                ...sx,
            }}
            {...props}
        >
            <SearchIcon />
            <FormattedMessage id='navbar.search.label' />
        </Button>
    );
}
