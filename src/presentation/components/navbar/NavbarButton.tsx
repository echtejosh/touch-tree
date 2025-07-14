import React, { ReactElement } from 'react';
import { alpha, Button, ButtonProps, Tooltip } from '@mui/material';
import { themePalette } from 'presentation/theme';

interface NavbarButtonProps extends ButtonProps {
    collapsed?: boolean;
    tooltipTitle?: string;
}

export default function NavbarButton({
    children,
    onClick,
    sx,
    collapsed = false,
    tooltipTitle = '',
    ...props
}: NavbarButtonProps): ReactElement {
    // If collapsed and we have a tooltip title, wrap with Tooltip
    const button = (
        <Button
            fullWidth
            onClick={onClick}
            size='large'
            sx={{
                mx: 2,
                gap: 2,
                color: alpha(themePalette.text.lighter, 0.6),
                ...(collapsed && {
                    justifyContent: 'center',
                    minWidth: '48px',
                    px: 1.5,
                    mx: 1.5,
                }),
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );

    return collapsed && tooltipTitle ? (
        <Tooltip placement='right' title={tooltipTitle}>
            {button}
        </Tooltip>
    ) : (
        button
    );
}
