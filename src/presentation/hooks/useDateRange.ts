import { useState, useMemo } from 'react';
import {
    TimePeriods,
    TimePeriodValue,
    DEFAULT_TIME_PERIOD,
} from 'presentation/constants/timePeriods';
import { dateRangeCalculator } from '../utils/dateRange';
import DateUtils from '../../utils/date';

interface UseDateRangeResult {
  startDate: Date | null;
  endDate: Date | null;
  timePeriod: TimePeriodValue;
  formattedDateRange: string;
  handleStartDateChange: (date: Date | null) => void;
  handleEndDateChange: (date: Date | null) => void;
  handleTimePeriodChange: (newValue: string) => void;
}

/**
 * Custom hook for managing date range selection
 * @param localeService Locale service for date formatting
 * @returns Date range state and handlers
 */
export function useDateRange(localeService: { getLocale: () => string }): UseDateRangeResult {
    const [timePeriod, setTimePeriod] = useState<TimePeriodValue>(DEFAULT_TIME_PERIOD);

    const [startDate, setStartDate] = useState<Date | null>(() => {
        const end = new Date();
        return dateRangeCalculator[DEFAULT_TIME_PERIOD](end);
    });

    const [endDate, setEndDate] = useState<Date | null>(new Date());

    /**
   * Updates the date range based on the selected time period
   * @param period The time period code
   */
    function updateDateRangeFromPeriod(period: TimePeriodValue): void {
        const end = new Date();
        const calculateStartDate = dateRangeCalculator[period];
        const start = calculateStartDate(end);

        setStartDate(start);
        setEndDate(end);
    }

    /**
   * Handle when time period selector changes
   * @param newValue The new time period value
   */
    function handleTimePeriodChange(newValue: string): void {
        const numericValue = Number(newValue) as TimePeriodValue;

        if (numericValue !== TimePeriods.CUSTOM) {
            setTimePeriod(numericValue);
            updateDateRangeFromPeriod(numericValue);
        }
    }

    /**
   * Handle start date change and set time period to custom
   * @param date The new date
   */
    function handleStartDateChange(date: Date | null): void {
        setStartDate(date);
        setTimePeriod(TimePeriods.CUSTOM);
    }

    /**
   * Handle end date change and set time period to custom
   * @param date The new date
   */
    function handleEndDateChange(date: Date | null): void {
        setEndDate(date);
        setTimePeriod(TimePeriods.CUSTOM);
    }

    const formattedDateRange = useMemo(() => {
        const locale = localeService.getLocale();

        return `${DateUtils.formatDate(startDate, locale)} - ${DateUtils.formatDate(endDate, locale)}`;
    }, [startDate, endDate, localeService]);

    return {
        startDate,
        endDate,
        timePeriod,
        formattedDateRange,
        handleStartDateChange,
        handleEndDateChange,
        handleTimePeriodChange,
    };
}
