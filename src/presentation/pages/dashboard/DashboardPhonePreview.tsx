import React from 'react';
import { Button } from '@mui/material';
import IPhoneFrame from 'presentation/components/IPhoneFrame';
import Container from 'infrastructure/services/Container';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import { useQuery } from 'presentation/hooks';
import useDialog from 'presentation/hooks/useDialog';
import QrCodeModal from 'presentation/modals/QrCodeModal';
import { QrCodeIcon } from 'presentation/components/icons';
import { Column } from 'presentation/components/layout';
import { getCurrentTheme } from 'presentation/themes/themeSelect';
import url from 'utils/url';
import { themePalette } from 'presentation/theme';

interface DashboardPhonePreviewProps {
    sx?: object;
}

export default function DashboardPhonePreview({
    sx,
    ...props
}: DashboardPhonePreviewProps) {
    const getMetricsUseCase = Container.resolve(GetMetricsUseCase);

    const { data: metrics } = useQuery(getMetricsUseCase.handle, [GetMetricsUseCase.name]);
    const theme = getCurrentTheme();

    const {
        openDialog,
    } = useDialog();

    function openQrCodeDialog() {
        openDialog(() => <QrCodeModal url={metrics?.publicUrl || String()} />);
    }

    return (
        <Column
            sx={{
                background: themePalette.background.light,
                position: 'fixed',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                height: '100dvh',
                justifyContent: 'center',
                alignItems: 'center',
                width: '30dvw',
                maxWidth: '30dvw',
                ...sx,
            }}
            {...props}
            gap={2}
        >
            <IPhoneFrame src={url.buildPhoneIframeSrc(metrics?.url)} />

            {!theme.subset && (
                <Button
                    onClick={openQrCodeDialog}
                    startIcon={<QrCodeIcon />}
                    sx={{ px: 2.5 }}
                    variant='outlined'
                >
                    QR-code and URL
                </Button>
            )}
        </Column>
    );
}
