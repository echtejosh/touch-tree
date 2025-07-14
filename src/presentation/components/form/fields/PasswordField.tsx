import React, { ReactElement, useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { VisibilityIcon, VisibilityOffIcon } from 'presentation/components/icons';
import { TextFieldElement, FieldValues, TextFieldElementProps } from 'react-hook-form-mui';
import { themePalette } from 'presentation/theme';

export default function PasswordField<T extends FieldValues>({
    ...props
}: TextFieldElementProps<T>): ReactElement {
    const [showPassword, setShowPassword] = useState(false);

    function handleToggle(): void {
        setShowPassword((prev): boolean => !prev);
    }

    return (
        <TextFieldElement
            fullWidth
            required
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton
                                edge='end'
                                onClick={handleToggle}
                                sx={{ color: themePalette.text.main }}
                            >
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
            type={showPassword ? 'text' : 'password'}
            variant='outlined'
            {...props}
        />
    );
}
