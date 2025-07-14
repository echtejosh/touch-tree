import { useContext } from 'react';
import { DateRange } from 'domain/models/MetricsModel';
import { DateContext } from '../../providers/DateProvider';

/**
 * Hook to access date range from DateProvider context
 * @returns Current date range from context
 */
export default function useDateContext(): DateRange {
    const context = useContext(DateContext);

    if (!context) {
        throw new Error('useDateContext must be used within a DateProvider');
    }

    return context.dateRange;
}
