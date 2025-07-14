import React from 'react';
import Tooltip, { CustomTooltipProps } from 'presentation/components/tooltip/Tooltip';
import { themePalette } from 'presentation/theme';
import { colors } from '@mui/material';

export default function EditorTooltip({
    label,
    children,
    ...props
}: CustomTooltipProps) {
    return (
        <Tooltip
            label={label}
            tooltipSx={{
                background: themePalette.tertiary.main,
                p: 0.5,
                fontSize: 13,
                fontWeight: 500,
                color: colors.common.white,
            }}
            {...props}
        >
            {children}
        </Tooltip>
    );
}
