import React, { ReactElement } from 'react';

import {
    Select,
    SelectChangeEvent,
    SxProps,
    Theme,
    InputLabel,
    FormControl,
    MenuItem,
} from '@mui/material';

export interface SelectDecoratorOption<T> {
    value: T;
    name: string;
}

export interface SelectDecoratorProps<T> {
    options: SelectDecoratorOption<T>[];
    label: string;
    sx?: SxProps<Theme>;
    onChange?: (value: T, selectedOption: SelectDecoratorOption<T>) => void;
    value?: T;
}

export function SelectDecorator<T>({
    options,
    label,
    value,
    onChange,
    sx,
}: SelectDecoratorProps<T>): ReactElement {
    function handleChange(event: SelectChangeEvent<T>): void {
        const selectedValue = event.target.value as T;
        const selectedOption = options.find((option) => option.value === selectedValue);

        if (selectedOption) {
            onChange?.(selectedValue, selectedOption);
        }
    }

    return (
        <FormControl sx={{ minWidth: 200, ...sx }}>
            <InputLabel>{label}</InputLabel>

            <Select
                displayEmpty
                label={label}
                onChange={handleChange}
                value={value}
                variant='outlined'
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.name}
                        value={option.value as string}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
