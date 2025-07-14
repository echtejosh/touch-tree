import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import DurationAccessService from 'application/services/api/DurationAccessService';
import { DurationAccessModel } from 'domain/models/DurationAccessModel';

export default function GetDurationAccessUseCase(): UseCaseContract<undefined, Promise<DurationAccessModel[] | null>> {
    const durationAccessService = Container.resolve(DurationAccessService);

    async function handle(): Promise<DurationAccessModel[] | null> {
        return durationAccessService.getTokens();
    }

    return {
        handle,
    };
}
