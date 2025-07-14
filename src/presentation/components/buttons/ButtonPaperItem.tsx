import React, { ReactNode } from 'react';
import { Box, MenuItem, SxProps, Theme } from '@mui/material';

interface ButtonPaperItemProps {
    onClick?: () => void;
    icon?: ReactNode;
    label: string;
    sx?: SxProps<Theme>;
    disabled?: boolean;
}

export default function ButtonPaperItem({
    onClick,
    icon,
    label,
    sx,
    disabled = false,
}: ButtonPaperItemProps) {
    return (
        <MenuItem disabled={disabled} onClick={onClick} sx={sx}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {icon}
                {label}
            </Box>
        </MenuItem>
    );
}
