import React from 'react';
import { IconButton, Tooltip, TooltipProps } from '@mui/material';
import { HelpIcon } from 'presentation/components/icons';

interface TooltipIconProps extends Omit<TooltipProps, 'title' | 'children'> {
    text: string;
}

export default function TooltipIcon({
    text,
    ...props
}: TooltipIconProps) {
    return (
        <Tooltip title={text} {...props}>
            <IconButton sx={{ p: 0, '&:hover': { backgroundColor: 'transparent' } }}>
                <HelpIcon sx={{ fontSize: 20 }} />
            </IconButton>
        </Tooltip>
    );
}
