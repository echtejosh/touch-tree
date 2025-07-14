import React, { ReactElement } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from 'presentation/components/navbar/Navbar';
import DashboardPhonePreview from 'presentation/pages/dashboard/DashboardPhonePreview';
import { useNavbarExpansionContext } from 'presentation/hooks/context/useNavbarExpansionContext';

export default function LayoutWithPlatform(): ReactElement {
    const { drawerWidth, isSmallScreen, COLLAPSED_WIDTH } = useNavbarExpansionContext();

    return (
        <Box display='flex' position='relative'>
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

            <Box minWidth='30dvw' />

            <Box>
                <DashboardPhonePreview />
            </Box>
        </Box>
    );
}
