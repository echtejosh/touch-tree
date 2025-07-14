import React, { ReactElement, SyntheticEvent, useState } from 'react';
import {
    Autocomplete,
    Checkbox,
    MenuItem,
    TextField,
    IconButton,
    Button,
    Box,
    SxProps,
    Theme,
    useTheme,
} from '@mui/material';
import {
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    CheckBox as CheckBoxIcon,
    DeleteOutline as DeleteIcon,
    AddOutlined as AddIcon,
    EditOutlined as EditIcon,
} from '@mui/icons-material';
import Tag from 'presentation/components/tags/Tag';

interface Option<T> {
    value: T;
    name: string;
}

export interface MultipleSelectWithActionsProps<T> {
    options: Option<T>[];
    label: string;
    sx?: SxProps<Theme>;
    onChange?: (value: T[]) => void;
    onDelete?: (option: Option<T>) => void;
    onEdit?: (name: string) => void;
    onAddCategory?: () => void;
    size?: 'small' | 'medium';
}

export function MultipleSelectWithActions<T>({
    options,
    label,
    onChange,
    onDelete,
    onEdit,
    onAddCategory,
    sx,
    size,
}: MultipleSelectWithActionsProps<T>): ReactElement {
    const [selectedOptions, setSelectedOptions] = useState<Option<T>[]>([]);
    const theme = useTheme();

    const handleChange = (event: SyntheticEvent, value: Option<T>[]): void => {
        setSelectedOptions(value);
        onChange?.(value.map((option): T => option.value));
    };

    return (
        <Box>
            <Autocomplete
                disableCloseOnSelect
                getOptionLabel={(option): string => option.name}
                isOptionEqualToValue={(option, value): boolean => option.value === value.value}
                limitTags={2}
                multiple
                onChange={handleChange}
                options={options}
                renderInput={(params): ReactElement => (
                    <TextField
                        {...params}
                        label={label}
                        placeholder='Search and select options'
                    />
                )}
                renderOption={(props, option, { selected, index }): ReactElement => (
                    <>
                        {onAddCategory && index === 0 && (
                            <Box
                                sx={{
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    marginBottom: 1,
                                    paddingBottom: 1,
                                    paddingX: 1,
                                }}
                            >
                                <Button
                                    onClick={onAddCategory}
                                    startIcon={<AddIcon />}
                                    sx={{ height: 35 }}
                                >
                                    Add Category
                                </Button>
                            </Box>
                        )}
                        <MenuItem
                            style={{ padding: 0, paddingLeft: 5 }}
                            {...props}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                }}
                            >
                                <Checkbox
                                    checked={selected}
                                    checkedIcon={(<CheckBoxIcon fontSize='small' />)}
                                    icon={(<CheckBoxOutlineBlankIcon fontSize='small' />)}
                                    style={{ marginRight: 3 }}
                                />

                                <Box
                                    sx={{
                                        display: 'none',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                        paddingRight: 1,
                                    }}
                                >
                                    {option.name}
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {onEdit && (
                                            <IconButton
                                                onClick={(e): void => {
                                                    e.stopPropagation();
                                                    onEdit(option.name);
                                                }}
                                                size='small'
                                            >
                                                <EditIcon fontSize='small' />
                                            </IconButton>
                                        )}
                                        {onDelete && (
                                            <IconButton
                                                onClick={(e): void => {
                                                    e.stopPropagation();
                                                    onDelete(option);
                                                }}
                                                size='small'
                                            >
                                                <DeleteIcon
                                                    fontSize='small'
                                                    sx={{
                                                        color: theme.palette.error.main,
                                                        transition: 'color 250ms',
                                                        ':hover': {
                                                            color: theme.palette.error.dark,
                                                        },
                                                    }}
                                                />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Box>

                                {option.name}
                            </Box>
                        </MenuItem>
                    </>
                )}
                renderTags={(value, getTagProps): ReactElement[] => value.map((option, index): ReactElement => (
                    <Tag
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option.value as string}
                    />
                ))}
                size={size}
                sx={sx}
                value={selectedOptions}
            />
        </Box>
    );
}
