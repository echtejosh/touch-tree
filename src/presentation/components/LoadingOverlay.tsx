import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingOverlayProps {
    isLoading: boolean;
}

export default function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
    if (!isLoading) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 10,
            }}
        >
            <CircularProgress />
        </Box>
    );
}
