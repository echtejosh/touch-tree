import { DateRange } from './MetricsModel';

export const StatisticsType = {
    Raw: 1,
    Publication: 2,
    Visitor: 3,
    HyperlinkClick: 4,
} as const;

export type StatisticsTypeId = typeof StatisticsType[keyof typeof StatisticsType];

export interface StatisticsModel extends Partial<DateRange> {
    typeId: StatisticsTypeId;
}
