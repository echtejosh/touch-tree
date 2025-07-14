import React from 'react';
import { Box } from '@mui/material';
import useViewportScale from 'presentation/hooks/useViewportScale';
import iPhoneImage from '../assets/iPhone-frame.png';

const DEFAULT_SCALE = 0.77;
const BASE_LINE = 1200;

interface IPhoneFrameProps {
    src: string;
}

export default function IPhoneFrame({ src }: IPhoneFrameProps) {
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
                    height: '71dvh',
                    width: '35dvh',
                    borderRadius: '3dvh',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: 'inherit',
                        height: 'inherit',
                        backgroundImage: `url(${iPhoneImage})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />
                <Box
                    component='iframe'
                    src={src}
                    sx={{
                        position: 'absolute',
                        width: `${100 / scale}%`,
                        height: `${100 / scale}%`,
                        minWidth: 310,
                        px: 2.2,
                        py: 2,
                        borderRadius: 8,
                        border: 'none',
                        zIndex: 1,
                        transform: `scale(${scale})`,
                        transformOrigin: '0 0',
                    }}
                />
            </Box>
        </Box>
    );
}
