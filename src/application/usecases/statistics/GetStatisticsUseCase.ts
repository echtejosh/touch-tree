import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';

import { FileShape } from 'domain/contracts/services/FileServiceContract';
import StatisticsService from 'application/services/api/newsstand/StatisticsService';
import { StatisticsModel } from 'domain/models/StatisticsModel';

export default function GetStatisticsUseCase(): UseCaseContract<StatisticsModel, Promise<FileShape | null>> {
    const statisticsService = Container.resolve(StatisticsService);

    async function handle(params: StatisticsModel): Promise<FileShape | null> {
        return statisticsService.getStatistics(params);
    }

    return {
        handle,
    };
}
