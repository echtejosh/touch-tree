import React, { ReactElement } from 'react';
import { TextFieldElement, FieldValues, TextFieldElementProps } from 'react-hook-form-mui';

interface InputFieldProps<T extends FieldValues> extends TextFieldElementProps<T> {
    readonly?: boolean;
}

export default function InputField<T extends FieldValues>({
    readonly,
    ...props
}: InputFieldProps<T>): ReactElement {
    return (
        <TextFieldElement
            fullWidth
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
            variant={readonly ? 'standard' : 'outlined'}
            {...props}
        />
    );
}
