import React, { ReactElement, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form-mui';
import { DoneIcon, ErrorIcon } from 'presentation/components/icons';
import { ButtonProps } from '@mui/material/Button';
import { Override } from '../../../../shared/types';

interface SubmitButtonProps<T extends FieldValues> {
    onSubmit: (values: T) => Promise<boolean>;
    handleSubmit: UseFormHandleSubmit<T>;
}

export const StatusTypes = {
    Idle: 0,
    Success: 1,
    Loading: 2,
    Error: 3,
} as const;

export type StatusType = typeof StatusTypes[keyof typeof StatusTypes];

export default function SubmitButton<T extends FieldValues>({
    handleSubmit,
    onSubmit,
    children,
    disabled,
    sx,
    ...props
}: Override<ButtonProps, SubmitButtonProps<T>>): ReactElement {
    const [status, setStatus] = useState<StatusType>(StatusTypes.Idle);

    async function _handleSubmit(values: T): Promise<void> {
        setStatus(StatusTypes.Loading);

        try {
            const result = await onSubmit(values);

            setStatus(result ? StatusTypes.Success : StatusTypes.Error);
            setTimeout(() => setStatus(StatusTypes.Idle), 2000);
        } catch (error) {
            console.log(error);
            setStatus(StatusTypes.Error);
        }
    }

    const icons: Record<StatusType, ReactElement | null> = {
        [StatusTypes.Idle]: null,
        [StatusTypes.Success]: <DoneIcon />,
        [StatusTypes.Error]: <ErrorIcon />,
        [StatusTypes.Loading]: <CircularProgress size={22} />,
    };

    return (
        <Button
            disabled={status === StatusTypes.Loading || disabled}
            onClick={handleSubmit(_handleSubmit)}
            size='large'
            sx={{
                gap: 1,
                ...sx,
            }}
            type='submit'
            variant='contained'
            {...props}
        >
            {children}
            {icons[status]}
        </Button>
    );
}
