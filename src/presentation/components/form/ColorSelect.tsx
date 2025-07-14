import React, { useState, FocusEvent, useRef, useEffect } from 'react';
import { Menu, TextField, useTheme, InputAdornment } from '@mui/material';
import { FieldValues, Path } from 'react-hook-form-mui';
import { Control, Controller } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import { Box } from 'presentation/components/layout';
import { themePalette } from 'presentation/theme';

interface ColorSelectProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    defaultColor: string;
    helperText?: string;
    inputWidth?: string | number;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export default function ColorSelect<T extends FieldValues>({
    control,
    name,
    label,
    defaultColor,
    inputWidth = '100%',
    helperText,
    onBlur,
}: ColorSelectProps<T>) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isValidColor, setIsValidColor] = useState<boolean>(true);
    const previousColorValueRef = useRef<string | null>(null);
    const { palette } = useTheme();

    function isValidHex(color: string): boolean {
        const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;
        return hexPattern.test(color);
    }

    function getBorderColor(value: string): string {
        if (!value) return themePalette.border.main;

        const isWhite = /^#(?:[fF]{3}|[fF]{6})$/.test(value);

        if (isWhite) return themePalette.border.main;
        return isValidColor ? 'transparent' : palette.error.main;
    }

    function triggerBlur(color: string): void {
        if (!onBlur) return;

        const hasColorChanged = previousColorValueRef.current !== color;

        if (hasColorChanged) {
            previousColorValueRef.current = color;

            const valid = isValidHex(color);
            setIsValidColor(valid);

            if (!valid) return;

            onBlur({
                target: {
                    name: name as string,
                    value: color,
                },
            } as FocusEvent<HTMLInputElement>);
        }
    }

    function handleOpen(event: React.MouseEvent<HTMLElement>): void {
        setAnchorEl(event.currentTarget);
    }

    function handleClose(color: string): void {
        triggerBlur(color);
        setAnchorEl(null);
    }

    function convertRgbToHex(str: string): string {
        const rgbMatch = str.replace(/[^\d,]/g, '').match(/^(\d{1,3}),(\d{1,3}),(\d{1,3})$/);

        if (rgbMatch) {
            const r = parseInt(rgbMatch[1], 10);
            const g = parseInt(rgbMatch[2], 10);
            const b = parseInt(rgbMatch[3], 10);

            if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
                const toHex = (value: number) => value.toString(16).padStart(2, '0');
                return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            }
        }

        return str;
    }

    console.log(defaultColor);

    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: {
                    onChange: _onChange,
                    value,
                },
            }) => {
                const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    let inputValue = event.target.value;

                    inputValue = convertRgbToHex(inputValue);

                    setIsValidColor(isValidHex(inputValue) || inputValue === '');
                    _onChange(inputValue);
                };

                useEffect(() => {
                    previousColorValueRef.current = value;
                }, []);

                return (
                    <>
                        <TextField
                            error={!isValidColor}
                            helperText={!isValidColor ? 'Invalid colour' : helperText}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <Box
                                            onClick={handleOpen}
                                            sx={{
                                                flexShrink: 0,
                                                width: 22,
                                                height: 22,
                                                backgroundColor: isValidHex(value)
                                                    ? value
                                                    : 'transparent',
                                                border: '1px solid transparent',
                                                borderColor: getBorderColor(value),
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            label={label}
                            onBlur={() => triggerBlur(value)}
                            onChange={handleInputChange} // Handle input change
                            placeholder='#000000'
                            size='medium'
                            sx={{
                                display: 'flex',
                                flexShrink: 0,
                                width: inputWidth,
                            }}
                            value={value}
                        />
                        <Menu
                            anchorEl={anchorEl}
                            MenuListProps={{
                                'aria-labelledby': 'color-box',
                            }}
                            onClose={() => handleClose(value)}
                            open={Boolean(anchorEl)}
                        >
                            <Box sx={{
                                px: 2,
                                py: 1,
                            }}
                            >
                                <HexColorPicker color={value} onChange={_onChange} />
                            </Box>
                        </Menu>
                    </>
                );
            }}
        />
    );
}
