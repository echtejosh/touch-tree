import React, { ReactElement } from 'react';
import { Box, Row } from 'presentation/components/layout';
import { Typography } from '@mui/material';
import { getCurrentTheme } from 'presentation/themes/themeSelect';
// import logo from 'presentation/assets/icon.svg';

interface NavbarLogoProps {
    collapsed?: boolean;
}

export default function NavbarLogo({ collapsed }: NavbarLogoProps): ReactElement {
    const theme = getCurrentTheme();

    const logoHeight = collapsed ? 40 : theme.logo.height;
    const logoSrc = collapsed
        ? theme.favicon || String()
        : theme.logo.src;

    return (
        <Box m={3}>
            <Row gap={1} justifyContent={collapsed ? 'center' : 'flex-start'}>
                <Box
                    alt='Company Logo'
                    component='img'
                    height={logoHeight}
                    src={logoSrc}
                    sx={{
                        transition: 'height 0.3s ease',
                    }}
                    width='auto'
                />

                {theme.name && !collapsed && (
                    <Typography
                        noWrap
                        sx={{
                            fontFamily: theme.name.fontFamily,
                            alignItems: 'end',
                            fontSize: 22,
                            color: '#fff',
                        }}
                    >
                        {theme.name.content}
                    </Typography>
                )}
            </Row>
        </Box>
    );
}
