import React, { createContext, ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 270;

export interface NavbarExpansionContextType {
    expanded: boolean;
    setExpanded: (val: boolean) => void;
    drawerWidth: number;
    isSmallScreen: boolean;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    COLLAPSED_WIDTH: number;
}

export const NavbarExpansionContext = createContext<NavbarExpansionContextType | undefined>(undefined);

interface NavbarExpansionProps {
    children: ReactNode;
}

export function NavbarExpansionProvider({ children }: NavbarExpansionProps): ReactElement {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('xl'));
    const [expanded, setExpanded] = useState(!isSmallScreen);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        setExpanded(!isSmallScreen);
    }, [isSmallScreen, navigator.maxTouchPoints]);

    const drawerWidth = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

    function handleMouseEnter(): void {
        // if (isSmallScreen && !isTouchDevice) {
        //     setExpanded(true);
        // }
    }

    function handleMouseLeave(): void {
        if (isSmallScreen && !isTouchDevice) {
            setExpanded(false);
        }
    }

    const value = useMemo(
        () => ({
            expanded,
            setExpanded,
            drawerWidth,
            isSmallScreen,
            COLLAPSED_WIDTH,
            handleMouseEnter,
            handleMouseLeave,
            isTouchDevice,
        }),
        [expanded, drawerWidth, isSmallScreen, isTouchDevice],
    );

    return (
        <NavbarExpansionContext.Provider value={value}>
            {children}
        </NavbarExpansionContext.Provider>
    );
}
