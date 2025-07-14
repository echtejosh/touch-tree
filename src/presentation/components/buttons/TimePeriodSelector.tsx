import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import { themePalette } from 'presentation/theme';
import {
    TimePeriods,
    TimePeriodValue,
    STANDARD_TIME_PERIODS,
} from 'presentation/constants/timePeriods';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '&.MuiToggleButtonGroup-root': {
        backgroundColor: themePalette.border.light,
    },
    '& .MuiToggleButtonGroup-grouped': {
        padding: '7px 16px',
        border: 0,
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
        fontSize: '14px',
        fontWeight: 600,
        opacity: 0.7,

        '&.Mui-selected': {
            backgroundColor: theme.palette.common.white,
            border: '1px solid',
            borderColor: themePalette.border.main,
            opacity: 1,
        },
    },
}));

const TimePeriodLabels: Record<TimePeriodValue, string> = {
    [TimePeriods.DAYS_7]: '7 days',
    [TimePeriods.DAYS_30]: '30 days',
    [TimePeriods.MONTHS_12]: '12 months',
    [TimePeriods.CUSTOM]: 'Custom',
};

interface TimePeriodSelectorProps {
    value: TimePeriodValue;
    onChange: (newValue: string) => void;
}

/**
 *
 */
export default function TimePeriodSelector({
    value,
    onChange,
}: TimePeriodSelectorProps) {
    return (
        <StyledToggleButtonGroup
            aria-label='time period'
            exclusive
            onChange={(_, newValue) => onChange(newValue)}
            size='small'
            value={value.toString()}
        >
            {STANDARD_TIME_PERIODS.map((period) => (
                <ToggleButton
                    key={period}
                    aria-label={TimePeriodLabels[period]}
                    value={period.toString()}
                >
                    {TimePeriodLabels[period]}
                </ToggleButton>
            ))}
            {value === TimePeriods.CUSTOM && (
                <ToggleButton
                    key={TimePeriods.CUSTOM}
                    aria-label='Custom'
                    value={TimePeriods.CUSTOM.toString()}
                >
                    {TimePeriodLabels[TimePeriods.CUSTOM]}
                </ToggleButton>
            )}
        </StyledToggleButtonGroup>
    );
}
