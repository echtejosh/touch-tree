import React, { ReactElement } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { themePalette } from 'presentation/theme';
import Navbar from 'presentation/components/navbar/Navbar';

export default function SecondaryLayout(): ReactElement {
    return (
        <Box
            display='flex'
            sx={{
                background: themePalette.background.light,
                minHeight: '100dvh',
                height: '100%',
            }}
        >
            <CssBaseline />
            <Navbar />

            <Container
                disableGutters
                maxWidth='xl'
            >
                <Outlet />
            </Container>
        </Box>
    );
}
