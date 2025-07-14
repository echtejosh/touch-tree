import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Box } from 'presentation/components/layout';
import { SxProps } from '@mui/material';

interface TooltipContextType {
    showTooltip(content: string, position: { top: number; left: number }): void;

    setTooltipProps(props: SxProps): void;

    hideTooltip(): void;
}

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

interface TooltipProviderProps {
    children: ReactNode;
}

export default function TooltipProvider({ children }: TooltipProviderProps) {
    const [_content, _setContent] = useState<string | null>(null);
    const [_props, _setProps] = useState<SxProps>({});

    const [_position, _setPosition] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });

    const showTooltip = (content: string, position: { top: number; left: number }) => {
        _setContent(content);
        _setPosition(position);
    };

    const hideTooltip = () => {
        _setContent(null);
    };

    const setTooltipProps = (props: SxProps) => {
        _setProps(props);
    };

    const values = useMemo(() => ({
        showTooltip,
        hideTooltip,
        setTooltipProps,
    }), []);

    return (
        <TooltipContext.Provider value={values}>
            {children}

            {_content && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: _position.top,
                        left: _position.left,
                        fontSize: 14,
                        fontWeight: 500,
                        padding: 1,
                        borderRadius: 1,
                        zIndex: 1000,
                        pointerEvents: 'none',

                        ..._props,
                    }}
                >
                    {_content}
                </Box>
            )}
        </TooltipContext.Provider>
    );
}

export function useTooltip(): TooltipContextType {
    return useContext(TooltipContext) as TooltipContextType;
}
