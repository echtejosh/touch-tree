import React, { ReactElement } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { Override } from '../../../shared/types';

export interface IconButtonProps {
    icon?: ReactElement,
}

export default function ButtonIcon({
    icon,
    sx,
    children,
    ...props
}: Override<ButtonProps, IconButtonProps>): ReactElement {
    return (
        <Button
            size='small'
            sx={{
                gap: 1,
                ...sx,
            }}
            variant='contained'
            {...props}
        >
            {icon}

            {children}
        </Button>
    );
}
