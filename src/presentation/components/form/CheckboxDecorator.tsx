import React, { useState } from 'react';
import { Checkbox } from '@mui/material';
import { Box, Row } from 'presentation/components/layout';

export interface CheckboxDecoratorProps {
    label?: string;
}

export default function CheckboxDecorator({ label }: CheckboxDecoratorProps) {
    const [checked, setChecked] = useState(false);

    function handleToggle(): void {
        setChecked((prev) => !prev);
    }

    return (
        <Row
            alignItems='center'
            gap={0}
            sx={{
                width: 'fit-content',

                '&:hover': {
                    cursor: 'pointer',
                },
            }}
        >
            <Checkbox
                checked={checked}
                onClick={handleToggle}
                sx={{ ml: '-11px' }}
            />

            {label && (
                <Box
                    component='span'
                    onClick={handleToggle}
                >
                    {label}
                </Box>
            )}
        </Row>
    );
}
