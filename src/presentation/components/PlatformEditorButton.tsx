import React, { cloneElement, ReactElement } from 'react';
import { Button, SxProps, Theme, Typography } from '@mui/material';
import { themePalette } from 'presentation/theme';
import { ButtonProps } from '@mui/material/Button';

export interface PlatformEditorButtonProps extends ButtonProps {
    label?: string;
    icon?: ReactElement;
    onClick?: () => void;
    sx?: SxProps<Theme>;
}

export default function PlatformEditorButton({
    label,
    icon,
    onClick,
    sx,
    ...props
}: PlatformEditorButtonProps) {
    return (
        <Button
            fullWidth
            onClick={onClick}
            sx={{
                px: 4,
                width: '100%',
                aspectRatio: '1 / 1',
                borderColor: themePalette.border.main,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: themePalette.text.main,
                whiteSpace: 'normal', // Allow text wrapping

                '&:hover': {
                    background: 'none',
                    borderColor: themePalette.primary.main,
                    color: themePalette.primary.main,
                },

                ...sx,
            }}
            variant='outlined'
            {...props}
        >
            {icon && cloneElement(icon, {
                sx: {
                    color: 'inherit',
                    mb: 1,

                    ...icon.props.sx,
                },
            })}
            <Typography
                variant='body1'
            >
                {label}
            </Typography>
        </Button>
    );
}
