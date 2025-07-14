import React, { useEffect, useRef, useState } from 'react';
import { useTooltip } from 'presentation/providers/TooltipProvider';
import { Box } from 'presentation/components/layout';
import { BoxProps, SxProps, Theme } from '@mui/material';

export interface CustomTooltipProps extends BoxProps {
    label: string;
    tooltipSx?: SxProps<Theme>;
}

export default function Tooltip({
    label,
    children,
    tooltipSx,
    ...props
}: CustomTooltipProps) {
    const {
        showTooltip,
        hideTooltip,
        setTooltipProps,
    } = useTooltip();

    useEffect(() => {
        if (tooltipSx) {
            setTooltipProps(tooltipSx as SxProps);
        }
    }, [tooltipSx]);

    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });

    const elementRef = useRef<HTMLDivElement | null>(null);

    const handleMouseEnter = () => {
        showTooltip(label, tooltipPosition);
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        const mouseX = event.clientX + 10;
        const mouseY = event.clientY + 10;

        setTooltipPosition({
            top: mouseY,
            left: mouseX,
        });

        showTooltip(label, {
            top: mouseY,
            left: mouseX,
        });
    };

    const handleMouseLeave = () => {
        hideTooltip();
    };

    return (
        <Box
            ref={elementRef}
            onMouseEnter={(event) => {
                event.stopPropagation();
                handleMouseEnter();
            }}
            onMouseLeave={(event) => {
                event.stopPropagation();
                handleMouseLeave();
            }}
            onMouseMove={(event) => {
                event.stopPropagation();
                handleMouseMove(event);
            }}
            {...props}
        >
            {children}
        </Box>
    );
}
