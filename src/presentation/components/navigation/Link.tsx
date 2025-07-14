import React, { ReactElement } from 'react';
import { Link, LinkOwnProps } from '@mui/material';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

export default function LinkDecorator({
    children,
    sx,
    ...props
}: LinkOwnProps & LinkProps): ReactElement {
    return (
        <Link
            component={RouterLink}
            sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                fontWeight: 500,

                ...sx,
            }}
            {...props}
        >
            {children}
        </Link>
    );
}
