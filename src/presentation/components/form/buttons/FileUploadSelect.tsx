import React, { useRef, ChangeEvent, useState, ReactElement } from 'react';
import { Button, Box, useTheme, SxProps, Theme } from '@mui/material';
import {
    Done as DoneIcon, Error as ErrorIcon,
    FileUploadOutlined as UploadIcon,
} from '@mui/icons-material';
import FileService from 'application/services/FileService';
import Container from 'infrastructure/services/Container';
import { CompareOptions, FileShape } from 'domain/contracts/services/FileServiceContract';
import { StatusTypes } from './SubmitButton';

type AllowedStatusTypes = Exclude<(typeof StatusTypes)[keyof typeof StatusTypes], 2>;

interface FileUploadSelectProps {
    onSelect: (file: FileShape) => Promise<boolean>;
    data: {
        accepts: string[],
        mimeTypes: string[],
        maxSizeInMb: number,
    },
    setError?: (name: string, error: { type: string; message?: string }) => void;
    name: string;
    label: string;
    sx?: SxProps<Theme>;
}

export default function FileUploadSelect({
    onSelect,
    data,
    setError,
    name,
    label,
    sx,
}: FileUploadSelectProps) {
    const fileService = Container.resolve(FileService);

    const [status, setStatus] = useState<AllowedStatusTypes>(StatusTypes.Idle);
    const fileRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();

    const iconMap: Record<AllowedStatusTypes, ReactElement | null> = {
        [StatusTypes.Idle]: null,
        [StatusTypes.Success]: <DoneIcon sx={{ color: theme.palette.primary.main }} />,
        [StatusTypes.Error]: <ErrorIcon sx={{ color: theme.palette.primary.main }} />,
    };

    const handleError = (errorMessage: string) => {
        console.log(errorMessage);
        if (setError) {
            setError(name, {
                type: 'manual',
                message: errorMessage,
            });
        }
    };

    const validateFileType = (type: string) => {
        const isValidType = data.mimeTypes.length && data.mimeTypes.includes(type);

        if (!isValidType) {
            handleError('Invalid file type. Please upload a valid file.');
        }

        return isValidType;
    };

    const validateFileSize = (size: number) => {
        const isInvalidSize = fileService.isLargerThan(
            { mb: size } as CompareOptions,
            { mb: data.maxSizeInMb || 5 } as CompareOptions,
        );

        if (isInvalidSize) {
            handleError(`File size exceeds the maximum limit of ${data.maxSizeInMb} MB`);
        }

        return !isInvalidSize;
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const fileData = event.target.files?.[0];

        if (!fileData || !validateFileType(fileData.type) || !validateFileSize(fileData.size)) {
            return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            const result = reader.result?.toString();

            if (!result) {
                return;
            }

            const response = await onSelect({
                name: fileData.name,
                content: result,
            });

            setStatus(response ? StatusTypes.Success : StatusTypes.Error);
        };

        reader.readAsDataURL(fileData);
    };

    const resetInputState = () => {
        if (status !== StatusTypes.Idle) {
            setStatus(StatusTypes.Idle);
        }

        if (fileRef.current) {
            fileRef.current.value = String();
        }
    };

    const handleButtonClick = () => {
        resetInputState();

        fileRef.current?.click();
    };

    return (
        <Box
            sx={{
                '&:hover': {
                    cursor: 'grabbing',
                },
            }}
        >
            <input
                ref={fileRef}
                accept={data.accepts.join(', ')}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                type='file'
            />
            <Button
                endIcon={iconMap[status]}
                onClick={handleButtonClick}
                size='large'
                startIcon={<UploadIcon sx={{ color: theme.palette.primary.main }} />}
                sx={{
                    '&:hover': {
                        cursor: 'grabbing',
                    },

                    ...sx,
                }}
                variant='contained'
            >
                {label}
            </Button>
        </Box>
    );
}
