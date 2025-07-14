import React from 'react';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from 'presentation/components/icons';
import { themePalette } from 'presentation/theme';
import { Row } from 'presentation/components/layout';

interface BackButtonProps {
    to?: string;
    label?: string;
}

export default function BackButton({
    label,
    to,
}: BackButtonProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <Row sx={{ position: 'relative' }}>
            <IconButton
                onClick={handleBack}
                sx={{
                    position: 'absolute',
                    top: -8,
                    left: -14,
                }}
            >
                <BackIcon
                    sx={{
                        color: themePalette.text.main,
                    }}
                />
            </IconButton>

            {label && (
                <Typography
                    onClick={handleBack}
                    sx={{
                        ml: 3,
                        color: themePalette.text.main,
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    {label}
                </Typography>
            )}
        </Row>
    );
}
