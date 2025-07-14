import React from 'react';
import { Button, SxProps, Theme } from '@mui/material';
import { DownloadIcon } from 'presentation/components/icons';
import { ButtonProps } from '@mui/material/Button';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import { useDownload } from 'presentation/hooks/useDownload';

interface DownloadButtonProps extends ButtonProps {
    file?: FileShape | null;
    label: string;
    icon?: React.ReactNode;
    sx?: SxProps<Theme>;
    onDownloadClick?: () => Promise<FileShape | null>;
}

export default function DownloadButton({
    file,
    label,
    icon = <DownloadIcon />,
    sx = {},
    onDownloadClick,
    ...props
}: DownloadButtonProps) {
    const { handleDownload } = useDownload();

    const onClick = async () => {
        await handleDownload(file, onDownloadClick);
    };

    return (
        <Button
            onClick={onClick}
            size='large'
            startIcon={icon}
            sx={{
                width: { xs: '100%', md: 'auto' },
                ...sx,
            }}
            variant='contained'
            {...props}
        >
            {label}
        </Button>
    );
}
