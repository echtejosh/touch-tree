import React, { useState, MouseEvent, ReactElement } from 'react';
import { Box } from 'presentation/components/layout';
import { BoxProps } from '@mui/material';

interface PreloadProps extends BoxProps {
    on(): Promise<void> | void;
}

export default function Preload({
    on,
    children,
    ...props
}: PreloadProps): ReactElement {
    const [hovered, setHovered] = useState<Map<HTMLElement, boolean>>(new Map());

    function handleHover(event: MouseEvent<HTMLElement>): void {
        const element = event.target as HTMLElement;

        if (!hovered.get(element)) {
            on();
            setHovered((prev): Map<HTMLElement, boolean> => new Map(prev).set(element, true));
        }
    }

    return (
        <Box
            onMouseEnter={handleHover}
            {...props}
        >
            {children}
        </Box>
    );
}
