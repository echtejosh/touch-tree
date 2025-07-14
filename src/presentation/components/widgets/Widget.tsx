import { Paper, PaperProps } from '@mui/material';
import React, { ReactElement } from 'react';

export function Widget({
    children,
    sx,
    ...props
}: PaperProps): ReactElement {
    return (
        <Paper
            sx={{ padding: 3, ...sx }}
            {...props}
        >
            {children}
        </Paper>
    );
}
