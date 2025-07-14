import React, { ReactElement } from 'react';
import { Box, LinearProgress, Theme, Typography } from '@mui/material';
import { themePalette } from 'presentation/theme';
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx';

interface ProgressBarProps {
    value: number;
    total: number;
    label: string;
    progressSx?: SystemStyleObject<Theme>;
    sx?: SystemStyleObject<Theme>;
}

export default function ProgressBar({
    value,
    total,
    label,
    progressSx,
    sx,
}: ProgressBarProps): ReactElement {
    const progress = Math.min(Math.max((value / total) * 100, 0), 100);

    return (
        <Box mt={2}>
            <Box
                display='flex'
                justifyContent='space-between'
                mb={1}
            >
                <Typography
                    sx={{
                        fontWeight: 500,
                        color: themePalette.text.light,
                    }}
                    variant='body2'
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: themePalette.text.light,
                    }}
                    variant='body2'
                >
                    {value}
                </Typography>
            </Box>

            <Box
                alignItems='center'
                display='flex'
            >
                <Box flexGrow={1} my={0}>
                    <LinearProgress
                        sx={{
                            borderRadius: 100,
                            height: 7,
                            backgroundColor: themePalette.background.light,

                            ...sx,

                            '& .MuiLinearProgress-bar': {
                                backgroundColor: themePalette.primary.main,

                                ...progressSx,
                            },
                        }}
                        value={progress}
                        variant='determinate'
                    />
                </Box>
            </Box>
        </Box>
    );
}
