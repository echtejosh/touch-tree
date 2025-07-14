import { DateRange, CampaignsStatisticsModel } from 'domain/models/MetricsModel';
import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import MetricsService from 'application/services/api/MetricsService';

/**
 * Use case to retrieve campaigns statistics data.
 */
export function GetCampaignsStatisticsUseCase(): UseCaseContract<DateRange, Promise<CampaignsStatisticsModel | null>> {
    const metricsService = Container.resolve(MetricsService);

    /**
     * Fetches campaigns statistics for the specified date range.
     *
     * @param dateRange - The date range to fetch statistics for.
     * @returns A promise resolving to the campaigns statistics or null.
     */
    function handle(dateRange: DateRange): Promise<CampaignsStatisticsModel | null> {
        return metricsService.getCampaigns(dateRange);
    }

    return {
        handle,
    };
}
