import React, { ReactElement, useState, createContext, useEffect, useMemo, ReactNode } from 'react';
import { DateRange } from 'domain/models/MetricsModel';

interface DateContextType {
  dateRange: DateRange;
}

export const DateContext = createContext<DateContextType | null>(null);

interface DateProviderProps {
  children: ReactNode;
  startDate?: Date | null;
  endDate?: Date | null;
}

export default function DateProvider({
    children,
    startDate = null,
    endDate = null,
}: DateProviderProps): ReactElement {
    const [dateRange, setDateRange] = useState<DateRange>({
        dateStart: startDate,
        dateFinal: endDate,
    });

    useEffect(() => {
        setDateRange({
            dateStart: startDate,
            dateFinal: endDate,
        });
    }, [startDate, endDate]);

    const contextValue = useMemo(() => ({ dateRange }), [dateRange]);

    return (
        <DateContext.Provider value={contextValue}>
            {children}
        </DateContext.Provider>
    );
}
