import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import MetricsService from 'application/services/api/MetricsService';
import { MetricsModel } from 'domain/models/MetricsModel';

export function GetMetricsUseCase(): UseCaseContract<undefined, Promise<MetricsModel | null>> {
    const metricsService = Container.resolve(MetricsService);

    function handle(): Promise<MetricsModel | null> {
        return metricsService.getMetrics();
    }

    return {
        handle,
    };
}
