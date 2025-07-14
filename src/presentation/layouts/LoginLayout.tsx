import React, { ReactElement } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Column } from 'presentation/components/layout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { NavbarLogo } from 'presentation/components/navbar';
import { themePalette } from 'presentation/theme';
import { getCurrentTheme } from 'presentation/themes/themeSelect';

export default function LoginLayout(): ReactElement {
    const { breakpoints } = useTheme();
    const theme = getCurrentTheme();

    const isLg = useMediaQuery(breakpoints.down('lg'));

    return (
        <Box display='flex'>
            <CssBaseline />

            <Column
                columns={isLg ? 1 : 2}
                gap={0}
                sx={{
                    height: '100vh',
                    width: '100%',
                }}
            >
                <Box
                    display={isLg ? 'none' : 'flex'}
                    sx={{
                        ...!theme.subset
                            ? {
                                background: themePalette.background.dark,
                            }
                            : {
                                background: !theme.subset ? themePalette.background.dark : theme.themeDark,
                            },

                        height: '100vh',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                        }}
                    >
                        <NavbarLogo />
                    </Box>
                </Box>

                <Box
                    display='flex'
                    mx={8}
                    sx={{
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Outlet />
                </Box>
            </Column>
        </Box>
    );
}
