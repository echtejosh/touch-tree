import React from 'react';
import { Box } from '@mui/material';
import iPadImage from 'presentation/assets/iPad-frame.png';
import useViewportScale from 'presentation/hooks/useViewportScale';

const DEFAULT_SCALE = 0.77;
const BASE_LINE = 1500;

interface IPadFrameProps {
    src: string;
}

export default function IPadFrame({ src }: IPadFrameProps) {
    const scale = useViewportScale(BASE_LINE, DEFAULT_SCALE);

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '81dvh',
                    height: '62dvh',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        zIndex: 2,
                        width: 'inherit',
                        height: 'inherit',
                        backgroundImage: `url(${iPadImage})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    component='iframe'
                    src={src}
                    sx={{
                        position: 'absolute',
                        top: 1,
                        left: 1.5,
                        zIndex: 1,
                        px: 4,
                        py: 4.2,
                        width: `${100 / scale}%`,
                        height: `${100 / scale}%`,
                        minWidth: 300,
                        border: 'none',
                        borderRadius: 6,
                        transform: `scale(${scale})`,
                        transformOrigin: '0 0',
                    }}
                />
            </Box>
        </Box>
    );
}
