import MetricsService from 'application/services/api/MetricsService';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { CreateDigiTokenUrlModel } from 'domain/models/MetricsModel';

export function CreateDigiTokenUrlUseCase(): UseCaseContract<undefined, Promise<CreateDigiTokenUrlModel | null>> {
    const metricsService = MetricsService();

    function handle(): Promise<CreateDigiTokenUrlModel | null> {
        return metricsService.createDigiTokenUrl();
    }

    return {
        handle,
    };
}
