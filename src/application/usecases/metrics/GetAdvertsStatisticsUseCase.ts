import { DateRange, AdvertsStatisticsModel } from 'domain/models/MetricsModel';
import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import MetricsService from 'application/services/api/MetricsService';

/**
 * Use case to retrieve adverts statistics data.
 */
export function GetAdvertsStatisticsUseCase(): UseCaseContract<DateRange, Promise<AdvertsStatisticsModel | null>> {
    const metricsService = Container.resolve(MetricsService);

    /**
     * Fetches adverts statistics for the specified date range.
     *
     * @param dateRange - The date range to fetch statistics for.
     * @returns A promise resolving to the adverts statistics or null.
     */
    function handle(dateRange: DateRange): Promise<AdvertsStatisticsModel | null> {
        return metricsService.getAdverts(dateRange);
    }

    return {
        handle,
    };
}
