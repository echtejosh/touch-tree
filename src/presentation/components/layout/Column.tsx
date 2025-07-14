import React, { ReactElement } from 'react';
import { Grid } from '@mui/material';
import { GridProps } from '@mui/material/Grid/Grid';

export default function Column({
    gap = 3,
    children,
    columns,
    sx,
    ...props
}: GridProps): ReactElement {
    return (
        <Grid
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap,

                ...columns && {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap,
                },

                ...sx,
            }}
            {...props}
        >
            {children}
        </Grid>
    );
}
