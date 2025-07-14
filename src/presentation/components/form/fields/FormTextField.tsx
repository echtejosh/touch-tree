import React from 'react';
import { Control } from 'react-hook-form';
import { FieldValues, Path, TextFieldElement, TextFieldElementProps } from 'react-hook-form-mui';

interface FormTextFieldProps<T extends FieldValues> extends TextFieldElementProps<T> {
    control: Control<T>;
    description?: string;
    readonly?: boolean;
    name: Path<T>;
    label: string;
}

export default function FormTextField<T extends FieldValues>({
    control,
    name,
    description,
    readonly,
    label,
    ...props
}: FormTextFieldProps<T>) {
    return (
        <TextFieldElement
            control={control}
            fullWidth
            helperText={description}
            label={label}
            name={name}
            required
            slotProps={{
                input: {
                    ...readonly && {
                        disableUnderline: true,
                        readOnly: true,
                    },

                    ...props.slotProps?.input,
                },

                ...props.slotProps,
            }}
            type='text'
            variant={readonly ? 'standard' : 'outlined'}
            {...props}
        />
    );
}
