import React, { ReactElement, ReactNode } from 'react';
import { Box, Chip, ChipProps, Theme } from '@mui/material';
import { CloseOutlined as CloseIcon } from '@mui/icons-material';
import { themePalette } from 'presentation/theme';
import { SystemCssProperties } from '@mui/system/styleFunctionSx/styleFunctionSx';
import { Override } from '../../../shared/types';

export interface TagProps {
    label?: string;
    icon?: ReactNode,
    sx?: SystemCssProperties<Theme>;
}

export default function Tag({
    label,
    sx,
    icon,
    ...props
}: Override<ChipProps, TagProps>): ReactElement {
    return (
        <Chip
            deleteIcon={(
                <CloseIcon
                    sx={{
                        fill: themePalette.text.main,
                        height: sx?.fontSize,
                    }}
                />
            )}
            label={(
                <Box
                    sx={{
                        px: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: sx?.fontSize,

                        ...sx,
                    }}
                >
                    {icon}
                    {label}
                </Box>
            )}
            sx={{
                borderRadius: 1,
                border: 'none',
                background: sx?.background || themePalette.background.light,
                fill: themePalette.text.main,
            }}
            variant='outlined'
            {...props}
        />
    );
}
