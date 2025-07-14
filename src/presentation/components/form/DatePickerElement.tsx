import React from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import { Path } from 'react-hook-form-mui';
import { DatePicker } from 'presentation/components/decorators';

interface ControlledDatePickerProps<T extends FieldValues> {
    name: keyof T;
    control: Control<T>;
    label: string;
    required?: boolean;
}

export default function DatePickerElement<T extends FieldValues>({
    name,
    control,
    label,
    required = false,
}: ControlledDatePickerProps<T>) {
    return (
        <Controller
            control={control}
            name={name as Path<T>}
            render={({ field, fieldState: { error } }) => (
                <DatePicker
                    {...field}
                    label={label}
                    onChange={field.onChange}
                    slotProps={{
                        textField: {
                            helperText: error?.message,
                            error: !!error,
                            size: 'medium',
                        },
                    }}
                />
            )}
            rules={{ required: required ? 'This field is required' : false }}
        />
    );
}
