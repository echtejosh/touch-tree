import React from 'react';
import { Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

interface FormLabelProps {
    id: string;
    defaultMessage?: string;
}

export default function FormLabel({
    id,
    defaultMessage,
}: FormLabelProps) {
    return (
        <Typography fontWeight={600}>
            <FormattedMessage
                defaultMessage={defaultMessage}
                id={id}
            />
        </Typography>
    );
}
