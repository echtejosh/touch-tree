import React, { ReactElement, useEffect, useState } from 'react';
import Container from 'infrastructure/services/Container';
import { Box, Column, Row } from 'presentation/components/layout';
import { themePalette } from 'presentation/theme';
import { PhoneIcon, TabletIcon, QrCodeIcon } from 'presentation/components/icons';
import { alpha, BoxProps, Button, colors, IconButton } from '@mui/material';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import { useQuery } from 'presentation/hooks';
import { Link } from 'react-router-dom';
import { Breakpoint, Breakpoints } from 'presentation/components/editor/types';
import IPhoneFrame from 'presentation/components/IPhoneFrame';
import IPadFrame from 'presentation/components/IPadFrame';
import { getCurrentTheme } from 'presentation/themes/themeSelect';
import url from 'utils/url';
import useDialog from 'presentation/hooks/useDialog';
import QrCodeModal from 'presentation/modals/QrCodeModal';
import { CreateDigiTokenUrlUseCase } from 'application/usecases/metrics/CreateDigiTokenUrlUseCase';
import { Override } from '../../../shared/types';

interface EditorPreviewCanvasProps {
    src?: string;
}

export default function EditorPreviewCanvas({
    sx,
    src,
    ...props
}: Override<BoxProps, EditorPreviewCanvasProps>): ReactElement {
    const getMetricsUseCase = Container.resolve(GetMetricsUseCase);
    const createDigiTokenUrlUseCase = Container.resolve(CreateDigiTokenUrlUseCase);

    const [breakpoint, setBreakpoint] = useState<Breakpoint>(Breakpoints.Phone);
    const [shouldFetchUrl, setShouldFetchUrl] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const { data: metrics } = useQuery(getMetricsUseCase.handle, [GetMetricsUseCase.name]);
    const { data: digiTokenUrl, isLoading: isLoadingUrl } = useQuery(
        createDigiTokenUrlUseCase.handle,
        [CreateDigiTokenUrlUseCase.name],
        {
            enabled: shouldFetchUrl,
        },
    );

    const theme = getCurrentTheme();

    const { openDialog } = useDialog();

    function openQrCodeDialog() {
        setShouldFetchUrl(true);

        if (digiTokenUrl?.previewUrl) {
            openDialog(() => <QrCodeModal url={digiTokenUrl.previewUrl} />);
        }
    }

    function handleDeviceSwitch(newBreakpoint: Breakpoint): void {
        if (newBreakpoint === breakpoint) return;

        setIsVisible(false);

        setTimeout(() => {
            setBreakpoint(newBreakpoint);
            setIsVisible(true);
        }, 200);
    }

    useEffect(() => {
        if (shouldFetchUrl && digiTokenUrl?.previewUrl) {
            openDialog(() => <QrCodeModal url={digiTokenUrl.previewUrl} />);
        }
    }, [digiTokenUrl, shouldFetchUrl]);

    return (
        <Box
            flex={1}
            gap={0}
            sx={{
                background: themePalette.background.light,
                position: 'relative',
                ...sx,
            }}
            {...props}
        >
            <Row gap={1} sx={{ position: 'absolute' }}>
                <Row
                    gap={0}
                    m={2}
                    mr={0}
                    sx={{
                        background: colors.common.white,
                        borderRadius: 1,
                    }}
                    zIndex={100}
                >
                    <IconButton
                        onClick={() => handleDeviceSwitch(Breakpoints.Phone)}
                        sx={{
                            color: themePalette.icon.light,
                            ...(breakpoint === Breakpoints.Phone && {
                                color: themePalette.icon.main,
                            }),
                        }}
                    >
                        <PhoneIcon />
                    </IconButton>

                    <IconButton
                        onClick={() => handleDeviceSwitch(Breakpoints.Tablet)}
                        sx={{
                            color: themePalette.icon.light,
                            ...(breakpoint === Breakpoints.Tablet && {
                                color: themePalette.icon.main,
                            }),
                        }}
                    >
                        <TabletIcon />
                    </IconButton>
                </Row>
            </Row>

            <Row
                gap={1}
                m={2}
                sx={{
                    position: 'absolute',
                    right: 0,
                    borderRadius: 1,
                }}
                zIndex={100}
            >
                <Box
                    sx={{
                        background: 'white',
                        borderRadius: 1,
                    }}
                >
                    {!theme.subset && (
                        <Button
                            component={Link}
                            sx={{
                                color: themePalette.text.main,
                                height: '100%',
                                '&:hover': {
                                    background: alpha(themePalette.text.main, 0.07),
                                },
                            }}
                            target='_blank'
                            to={metrics?.url as string}
                        >
                            Open in browser
                        </Button>
                    )}
                </Box>
            </Row>

            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100dvh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                <Column alignItems='center'>
                    <Box
                        sx={{
                            opacity: isVisible ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                        }}
                    >
                        {breakpoint === Breakpoints.Phone
                            ? (<IPhoneFrame src={url.buildPhoneIframeSrc(metrics?.url)} />)
                            : (<IPadFrame src={src || String()} />)}
                    </Box>

                    {theme.subset && (
                        <Button
                            disabled={isLoadingUrl}
                            onClick={openQrCodeDialog}
                            startIcon={<QrCodeIcon />}
                            sx={{
                                px: 2.5,
                                width: 'fit-content',
                            }}
                            variant='outlined'
                        >
                            {isLoadingUrl ? 'Loading...' : 'QR-code and URL'}
                        </Button>
                    )}
                </Column>
            </Box>
        </Box>
    );
}
