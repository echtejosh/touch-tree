import React, { useRef } from 'react';
import { Box, Column } from 'presentation/components/layout';
import { Typography, TextField, Button, Link } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';

interface QrCodeModalProps {
    url: string;
}

export default function QrCodeModal({ url }: QrCodeModalProps) {
    const qrCodeRef = useRef<HTMLCanvasElement | null>(null);

    async function copyQrCode(): Promise<void> {
        if (!qrCodeRef.current) {
            return;
        }

        qrCodeRef.current.toBlob(async (imageBlob) => {
            if (!imageBlob) {
                return;
            }

            await navigator.clipboard.write([
                new ClipboardItem({ [imageBlob.type]: imageBlob }),
            ]);
        });
    }

    const copyUrl = () => {
        navigator.clipboard
            .writeText(url)
            .catch((err) => console.error('Failed to copy URL:', err));
    };

    return (
        <Box p={4}>
            <Typography gutterBottom variant='h2'>
                QR-code or URL
            </Typography>

            <Column columns={2} gap={0}>
                <Column alignItems='center' justifyContent='space-between'>
                    <Box m={3}>
                        <Link href={url} rel='noopener noreferrer' target='_blank'>
                            <QRCodeCanvas ref={qrCodeRef} size={128} value={url} />
                        </Link>
                    </Box>

                    <Box>
                        <Button onClick={copyQrCode} variant='contained'>
                            Copy QR-code
                        </Button>
                    </Box>
                </Column>

                <Column alignItems='center' justifyContent='space-between'>
                    <Box my={3} width='100%'>
                        <TextField
                            fullWidth
                            label='URL'
                            multiline
                            slotProps={{
                                input: {
                                    disableUnderline: true,
                                    readOnly: true,
                                },
                            }}
                            value={url}
                            variant='outlined'
                        />
                    </Box>

                    <Box>
                        <Button onClick={copyUrl} variant='contained'>
                            Copy URL
                        </Button>
                    </Box>
                </Column>
            </Column>
        </Box>
    );
}
