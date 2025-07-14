import React from 'react';
import { Controller, FieldValues, Path, Control } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

type AutocompleteElementProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    options: Array<{ id: number; label: string }>;
    label: string;
    onOptionClick?: () => void;
    required?: boolean;
    sx?: object;
};

export default function AutocompleteElement<T extends FieldValues>({
    control,
    name,
    options,
    label,
    onOptionClick,
    required = false,
    sx,
}: AutocompleteElementProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Autocomplete
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) => {
                        onChange(newValue?.id);
                    }}
                    options={options}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={!!error}
                            helperText={error?.message}
                            label={label}
                            onClick={onOptionClick}
                        />
                    )}
                    sx={{ display: 'flex', flex: 1, ...sx }}
                    value={options.find((option) => option.id === value) || null}
                />
            )}
            rules={{ required: required && 'This field is required' }}
        />
    );
}
