import React, { ReactElement } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from 'presentation/components/navbar/Navbar';
import { useNavbarExpansionContext } from 'presentation/hooks/context/useNavbarExpansionContext';

export default function Layout(): ReactElement {
    const { drawerWidth, isSmallScreen, COLLAPSED_WIDTH } = useNavbarExpansionContext();

    return (
        <Box display='flex'>
            <CssBaseline />
            <Navbar />

            <Container
                disableGutters
                maxWidth='xl'
                sx={{
                    marginLeft: `${isSmallScreen ? COLLAPSED_WIDTH : drawerWidth}px`,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Outlet />
            </Container>
        </Box>
    );
}
