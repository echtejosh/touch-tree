import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import MetricsService from 'application/services/api/MetricsService';
import { DateRange, VisitorsStatisticsModel } from 'domain/models/MetricsModel';

export function GetVisitorsUseCase(): UseCaseContract<DateRange, Promise<VisitorsStatisticsModel | null>> {
    const metricsService = Container.resolve(MetricsService);

    function handle(dateRange: DateRange): Promise<VisitorsStatisticsModel | null> {
        return metricsService.getVisitors(dateRange);
    }

    return {
        handle,
    };
}
