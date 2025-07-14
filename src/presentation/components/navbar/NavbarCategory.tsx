import React, { ReactElement } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';

interface NavbarCategoryProps extends BoxProps {
    label?: string;
}

export default function NavbarCategory({
    label,
    ...props
}: NavbarCategoryProps): ReactElement {
    return (
        <Box
            mb={1}
            mt={2}
            mx={3.5}
            {...props}
        >
            <Typography
                fontSize={14}
                fontWeight={400}
                sx={{ color: 'rgba(255,255,255)' }}
            >
                {label}
            </Typography>
        </Box>
    );
}
