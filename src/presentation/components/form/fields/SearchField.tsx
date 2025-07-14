import React, { ReactElement, useState, useRef, KeyboardEvent, useEffect } from 'react';
import {
    IconButton,
    InputAdornment,
    TextField,
    MenuItem,
    MenuList,
    Popper,
    Paper,
    SxProps,
    Theme,
    Typography,
} from '@mui/material';
import { BaseTextFieldProps } from '@mui/material/TextField/TextField';
import { CloseIcon } from 'presentation/components/icons';
import { themePalette } from 'presentation/theme';
import { Box } from 'presentation/components/layout';
import { Override } from '../../../../shared/types';

interface SearchFieldProps {
    onChange?: (value: string) => void;
    value?: string;
    autoCompleteRefs?: string[];
    sx?: SxProps<Theme>;
}

export default function SearchField({
    onChange,
    value,
    autoCompleteRefs = [],
    sx,
    ...props
}: Override<BaseTextFieldProps, SearchFieldProps>): ReactElement {
    const [_value, _setValue] = useState(value || String());
    const [selected, setSelected] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        if (!_value) {
            setLabels([]);
        }

        setLabels(
            autoCompleteRefs.filter((label): boolean => String(label)
                ?.toLowerCase()
                .startsWith(String(_value)
                    ?.toLowerCase())),
        );
    }, [autoCompleteRefs, _value]);

    const handleChange = (val: string): void => {
        onChange?.(val);
        _setValue(val);

        setOpen(Boolean(val) && labels.length > 0);
        setSelected(null);
    };

    const handleSelection = (label: string): void => {
        handleChange(label);
        inputRef.current?.focus();
        setOpen(false);
    };

    const handleTabOrEnter = (): void => {
        if (selected !== null && labels[selected]) {
            handleSelection(labels[selected]);
        } else if (labels.length > 0) {
            handleSelection(labels[0]);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (!labels.length) {
            return;
        }

        const updateIndex = (delta: number): void => {
            setSelected((prev): number => {
                const currentIndex = prev ?? -1;
                const nextIndex = currentIndex + delta;

                if (nextIndex < 0) {
                    return labels.length - 1;
                }

                if (nextIndex >= labels.length) {
                    return 0;
                }

                return nextIndex;
            });
        };

        const keyHandlers: Record<string, () => void> = {
            Tab: handleTabOrEnter,
            Enter: handleTabOrEnter,
            ArrowDown: (): void => updateIndex(1),
            ArrowUp: (): void => updateIndex(-1),
        };

        if (keyHandlers[event.key]) {
            event.preventDefault();
            keyHandlers[event.key]();
        }
    };

    const renderHighlightedLabel = (label: string): ReactElement => {
        const matchStartIndex = label?.toLowerCase()
            .indexOf(_value?.toLowerCase());

        if (matchStartIndex === -1) {
            return <Box>{label}</Box>;
        }

        const beforeMatch = label.substring(0, matchStartIndex);
        const match = label.substring(matchStartIndex, matchStartIndex + _value.length);
        const afterMatch = label.substring(matchStartIndex + _value.length);

        return (
            <Box
                sx={{
                    color: themePalette.text.main,
                }}
            >
                {beforeMatch}
                <Typography
                    component='span'
                    sx={{
                        fontWeight: 500,
                        color: themePalette.primary.main,
                    }}
                >
                    {match}
                </Typography>
                {afterMatch}
            </Box>
        );
    };

    return (
        <Box flex={1}>
            <TextField
                inputRef={inputRef}
                label='Search'
                onChange={(event): void => handleChange(event.target.value)}
                onKeyDown={handleKeyDown}
                slotProps={{
                    input: {
                        endAdornment: _value && (
                            <InputAdornment position='end'>
                                <IconButton
                                    edge='end'
                                    onClick={() => handleChange(String())}
                                    sx={{
                                        padding: 0.5,
                                        m: 0,
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{ border: 0 }}
                value={_value}
                variant='outlined'
                {...props}
            />

            <Popper
                anchorEl={inputRef.current}
                open={open}
                placement='bottom-start'
                sx={{
                    zIndex: 1,

                    ...sx,
                }}
            >
                <Paper>
                    <MenuList>
                        {labels.map((label, index): ReactElement => (
                            <MenuItem
                                key={label}
                                onClick={(): void => handleSelection(label)}
                                selected={index === selected}
                                sx={{
                                    background: index === selected ? themePalette.background.light : 'none',
                                }}
                            >
                                {renderHighlightedLabel(String(label))}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </Popper>
        </Box>
    );
}
