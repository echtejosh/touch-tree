import React, { ReactElement } from 'react';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';

interface DatePickerDecoratorProps extends DatePickerProps<Date> {
    label: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    format?: string;
    size?: 'small' | 'medium';
    width?: number | string;
}

export default function DatePickerDecorator({
    label,
    value,
    onChange,
    format = 'd MMM yyyy',
    size = 'small',
    width = 250,
    ...props
}: DatePickerDecoratorProps): ReactElement {
    return (
        <DatePicker
            format={format}
            label={label}
            onChange={onChange}
            slotProps={{
                textField: {
                    size,
                    ...props.slotProps?.textField,
                },
                popper: {
                    disablePortal: true,
                },
            }}
            sx={{
                width,
            }}
            value={value}
        />
    );
}
