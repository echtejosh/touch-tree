import React, { ReactElement } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { themePalette } from 'presentation/theme';

/**
 *
 * @constructor
 */
export default function ButtonSecondary({
    sx,
    children,
    ...props
}: ButtonProps): ReactElement {
    return (
        <Button
            sx={{
                border: 1,
                borderColor: themePalette.border.main,
                color: themePalette.text.main,

                '&:hover': {
                    background: themePalette.background.light,
                },

                ...sx,
            }}
            variant='outlined'
            {...props}
        >
            {children}
        </Button>
    );
}
