import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface ImgProps extends BoxProps {
    src: string;
    height?: number | string;
    width?: number | string;
}

export default function Img({
    src,
    height,
    width,
    sx,
    children,
}: ImgProps) {
    return (
        <Box
            sx={{
                background: `url(${src})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                minHeight: height,
                height,
                minWidth: width,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}
