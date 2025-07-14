import { Box } from 'presentation/components/layout';
import { FormControlLabel, Radio } from '@mui/material';
import React, { ReactElement, useRef } from 'react';

export interface RadioSelectAreaProps {
    label: string;
}

export default function RadioSelectArea({ label }: RadioSelectAreaProps): ReactElement {
    const ref = useRef<HTMLLabelElement>(null);

    return (
        <Box>
            <Box
                onClick={ref.current?.click}
                sx={{
                    height: 120,
                    background: '#efefef',
                    borderRadius: 1,
                }}
            />

            <FormControlLabel
                ref={ref}
                control={<Radio />}
                label={label}
                value={0}
            />
        </Box>
    );
}
