import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import MetricsService from 'application/services/api/MetricsService';
import { DateRange, PagesStatisticsModel } from 'domain/models/MetricsModel';

/**
 * Use case to retrieve page view statistics data.
 */
export function GetPagesUseCase(): UseCaseContract<DateRange, Promise<PagesStatisticsModel | null>> {
    const metricsService = Container.resolve(MetricsService);

    /**
     * Retrieves page view statistics data from the metrics service.
     *
     * @param dateRange - The date range to fetch page view statistics for
     * @returns A promise that resolves to page view statistics or null if not found
     */
    function handle(dateRange: DateRange): Promise<PagesStatisticsModel | null> {
        return metricsService.getPages(dateRange);
    }

    return {
        handle,
    };
}
