import React, {
    useRef,
    ChangeEvent,
    MouseEvent,
    ReactNode,
    ReactElement,
} from 'react';
import { SxProps, Theme, TextField, IconButton, InputAdornment, Box } from '@mui/material';
import { AttachFile as AttachFileIcon, Close as CloseIcon } from '@mui/icons-material';
import {
    Control,
    Controller,
    FieldValues,
    Path,
} from 'react-hook-form';
import { CompareOptions, FileShape } from 'domain/contracts/services/FileServiceContract';
import Container from 'infrastructure/services/Container';
import FileService from 'application/services/FileService';

interface FileSelectProps<T extends FieldValues> {
    accepts: string[];
    label: string;
    control: Control<T>;
    name: Path<T>;
    description: ReactNode | string;
    placeholder: string;
    size?: CompareOptions;
    sx?: SxProps<Theme>;
    required?: boolean;
    requireJpegConversion?: boolean;
    onChange?: (file: FileShape | null) => void;
}

export default function FileSelect<T extends FieldValues>({
    accepts,
    placeholder,
    description,
    label,
    control,
    name,
    size,
    sx,
    onChange,
    required = true,
    requireJpegConversion = false,
}: FileSelectProps<T>): ReactElement {
    const fileService = Container.resolve(FileService);

    const ref = useRef<HTMLInputElement | null>(null);

    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: {
                    onChange: _onChange,
                    value: _value,
                },
            }): ReactElement => {
                const value = _value as FileShape | undefined;

                function handleChange(event: ChangeEvent<HTMLInputElement>): void {
                    const selected = event.target.files?.[0];

                    if (!selected) {
                        return;
                    }

                    if (fileService.isLargerThan(
                        { b: selected.size } as CompareOptions,
                        { ...size || { mb: 5 } } as CompareOptions)
                    ) {
                        return;
                    }

                    const reader = new FileReader();

                    reader.onload = (): void => {
                        if (requireJpegConversion && selected.type !== 'image/jpeg') {
                            const image = new Image();

                            image.onload = (): void => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');

                                canvas.width = image.width;
                                canvas.height = image.height;

                                ctx?.drawImage(image, 0, 0);

                                const jpegDataUrl = canvas.toDataURL('image/jpeg');

                                const file: FileShape = {
                                    name: selected.name,
                                    content: jpegDataUrl,
                                };

                                _onChange(file);
                                onChange?.(file);
                            };

                            image.src = reader.result as string;
                            return;
                        }

                        const file: FileShape = {
                            name: selected.name,
                            content: reader.result as string,
                        };

                        _onChange(file);
                        onChange?.(file);
                    };

                    reader.readAsDataURL(selected);
                }

                function handleClear(event: MouseEvent): void {
                    event.stopPropagation();

                    if (ref.current) {
                        ref.current.value = String();
                    }

                    _onChange(null);
                    onChange?.(null);
                }

                return (
                    <Box flex={1}>
                        <TextField
                            helperText={description}
                            label={label}
                            onClick={(): void => ref.current?.click()}
                            placeholder={placeholder}
                            required={required}
                            slotProps={{
                                htmlInput: {
                                    readOnly: true,
                                },
                                inputLabel: {
                                    shrink: true,
                                },
                                input: {
                                    startAdornment: (
                                        <AttachFileIcon
                                            sx={{
                                                mr: 1,
                                                fontSize: 20,
                                            }}
                                        />
                                    ),
                                    endAdornment: value?.name && (
                                        <InputAdornment position='end'>
                                            <IconButton onClick={handleClear} sx={{ p: 0.5 }}>
                                                <CloseIcon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        cursor: 'pointer',

                                        '&:hover': {
                                            cursor: 'pointer !important',
                                        },
                                    },
                                },
                            }}
                            sx={{
                                cursor: 'pointer',

                                '& .MuiInputBase-input': {
                                    cursor: 'pointer',
                                },

                                ...sx,
                            }}
                            value={value?.name || String()}
                        />

                        <Box
                            ref={ref}
                            accept={accepts.join(', ')}
                            component='input'
                            hidden
                            onChange={(event): void => {
                                const _clone = { ...event };

                                _clone.target.name = name;

                                handleChange(_clone);
                            }}
                            type='file'
                        />
                    </Box>
                );
            }}
        />
    );
}
