import React, { ReactElement } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from 'presentation/components/navbar/Navbar';
import { useNavbarExpansionContext } from 'presentation/hooks/context/useNavbarExpansionContext';

export default function RelativeLayout(): ReactElement {
    const { drawerWidth, isSmallScreen, COLLAPSED_WIDTH } = useNavbarExpansionContext();

    return (
        <Box display='flex'>
            <CssBaseline />
            <Navbar />

            <Box
                sx={{
                    marginLeft: `${isSmallScreen ? COLLAPSED_WIDTH : drawerWidth}px`,
                    transition: 'margin-left 0.3s ease',
                }}
                width='100%'
            >
                <Outlet />
            </Box>
        </Box>
    );
}
