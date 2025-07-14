import React from 'react';
import { Typography } from '@mui/material';
import { Box, Column } from 'presentation/components/layout';
import {
    PaletteIcon,
    LogoIcon,
    LayoutIcon,
    WebsiteIcon, BannersIcon,
} from 'presentation/components/icons';
import { themePalette } from 'presentation/theme';
import Preload from 'presentation/components/preload/Preload';
import { usePrefetchQuery } from 'presentation/hooks';
import Container from 'infrastructure/services/Container';
import GetEditorLogoUseCase from 'application/usecases/newsstand/editor/GetEditorLogoUseCase';
import GetEditorFaviconUseCase from 'application/usecases/newsstand/editor/GetEditorFaviconUseCase';
import GetEditorColorsUseCase from 'application/usecases/newsstand/editor/GetEditorColorsUseCase';
import GetEditorPodsUseCase from 'application/usecases/newsstand/editor/GetEditorPodsUseCase';
import PlatformEditorLink from 'presentation/components/PlatformEditorLink';
import GetEditorAdditionalPodsUseCase from 'application/usecases/newsstand/editor/GetEditorAdditionalPodsUseCase';
import { getCurrentTheme } from 'presentation/themes/themeSelect';

export default function EditorTabs() {
    const getEditorColorsUseCase = Container.resolve(GetEditorColorsUseCase);
    const getEditorPodsUseCase = Container.resolve(GetEditorPodsUseCase);
    const getEditorAdditionalPodsUseCase = Container.resolve(GetEditorAdditionalPodsUseCase);
    const getEditorLogoUseCase = Container.resolve(GetEditorLogoUseCase);
    const getEditorFaviconUseCase = Container.resolve(GetEditorFaviconUseCase);
    const theme = getCurrentTheme();

    return (
        <Column gap={0} width={560}>
            {/*
              <Column gap={0}> is required here to handle cases where the children's
              width exceeds the viewport width. It also ensures proper scroll behavior for overflow content.
              Do not remove or modify unless absolutely necessary.
            */}
            <Box p={4}>
                <Typography
                    mb={2}
                    variant='h2'
                >
                    Visual layout
                </Typography>

                <Typography
                    fontWeight={500}
                    sx={{
                        color: themePalette.text.main,
                        fontWeight: 500,
                    }}
                >
                    Categories
                </Typography>
            </Box>

            <Column columns={2} gap={2} sx={{ p: 4, pt: 0, overflowY: 'auto' }}>
                <Preload
                    on={(): void => {
                        usePrefetchQuery(getEditorColorsUseCase.handle, [GetEditorColorsUseCase.name]);
                    }}
                >
                    <PlatformEditorLink
                        icon={<PaletteIcon />}
                        label='Colours'
                        to='colors'
                    />
                </Preload>

                <Preload
                    on={(): void => {
                        usePrefetchQuery(getEditorPodsUseCase.handle, [GetEditorPodsUseCase.name]);
                        usePrefetchQuery(getEditorAdditionalPodsUseCase.handle, [GetEditorAdditionalPodsUseCase.name]);
                    }}
                >
                    <PlatformEditorLink
                        icon={<LayoutIcon />}
                        label='Pods'
                        to='pods'
                    />
                </Preload>

                <Preload
                    on={(): void => {
                        usePrefetchQuery(getEditorLogoUseCase.handle, [GetEditorLogoUseCase.name]);
                    }}
                >
                    <PlatformEditorLink
                        icon={<LogoIcon />}
                        label='Logo'
                        to='logo'
                    />
                </Preload>

                <Preload
                    on={(): void => {
                        usePrefetchQuery(getEditorFaviconUseCase.handle, [GetEditorFaviconUseCase.name]);
                    }}
                >
                    <PlatformEditorLink
                        icon={<WebsiteIcon />}
                        label='Browser'
                        to='browser'
                    />
                </Preload>

                {theme.subset && (
                    <Preload
                        on={(): void => {
                            usePrefetchQuery(getEditorPodsUseCase.handle, [GetEditorPodsUseCase.name]);
                        }}
                    >
                        <PlatformEditorLink
                            icon={<BannersIcon />}
                            label='Banners'
                            to='banners'
                        />
                    </Preload>
                )}
            </Column>
        </Column>
    );
}
