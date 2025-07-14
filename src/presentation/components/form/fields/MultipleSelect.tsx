import React, { ReactElement, useState } from 'react';
import {
    Autocomplete,
    Checkbox, InputProps,
    MenuItem,
    SxProps,
    TextField,
    Theme,
} from '@mui/material';
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from 'presentation/components/icons';
import { Box } from 'presentation/components/layout';
import Tag from 'presentation/components/tags/Tag';
import { Override } from '../../../../shared/types';

export interface MultipleSelectOption<T> {
    value: T;
    name: string;
}

export interface MultipleSelectProps<T> {
    options: MultipleSelectOption<T>[];
    label: string;
    sx?: SxProps<Theme>;
    onChange?: (value: T[], values: MultipleSelectOption<T>[]) => void;
    value?: MultipleSelectOption<T>[],
    disablePortal?: boolean;
}

export function MultipleSelect<T>({
    options,
    label,
    value: _value = [],
    onChange,
    size,
    sx,
    disablePortal = true,
}: Override<InputProps, MultipleSelectProps<T>>): ReactElement {
    const [selectedOptions, setSelectedOptions] = useState<MultipleSelectOption<T>[]>(_value);

    const handleChange = (value: MultipleSelectOption<T>[]): void => {
        setSelectedOptions(value);

        onChange?.(value.map((option): T => option.value), value);
    };

    return (
        <Autocomplete
            disableCloseOnSelect
            disablePortal={disablePortal}
            getOptionLabel={(option): string => option.name}
            isOptionEqualToValue={(option, value): boolean => option.value === value.value}
            limitTags={2}
            multiple
            onChange={(_, value): void => handleChange(value)}
            options={options}
            renderInput={(params): ReactElement => (
                <TextField
                    {...params}
                    label={label}
                    placeholder='Search and select options'
                />
            )}
            renderOption={(props, option, { selected }): ReactElement => (
                <MenuItem
                    style={{
                        padding: 0,
                        paddingLeft: 5,
                    }}
                    {...props}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Checkbox
                            checked={selected}
                            checkedIcon={(<CheckBoxIcon fontSize='small' />)}
                            icon={(<CheckBoxOutlineBlankIcon fontSize='small' />)}
                            style={{ marginRight: 3 }}
                        />
                        {option.name}
                    </Box>
                </MenuItem>
            )}
            renderTags={(value, getTagProps): ReactElement[] => value.map((option, index): ReactElement => (
                <Tag
                    label={option.name}
                    sx={{ fontSize: 14 }}
                    {...getTagProps({ index })}
                    key={option.value as string}
                />
            ))}
            size={size}
            sx={sx}
            value={selectedOptions}
        />
    );
}
