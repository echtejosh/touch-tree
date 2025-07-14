import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import endpoints from 'infrastructure/routes/endpoints';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import { StatisticsModel, StatisticsType, StatisticsTypeId } from 'domain/models/StatisticsModel';
import date from 'utils/date';

interface GetFileResponse {
    response: Response;
}

interface GetStatisticsFilePayload {
    typeId: StatisticsTypeId;
    dateStart: number;
    dateFinal: number;
}

export default function StatisticsService() {
    const apiService = Container.resolve(ApiService);

    async function getStatistics({ typeId, dateStart, dateFinal }: StatisticsModel): Promise<FileShape | null> {
        const currentDate = new Date();

        const defaultDateStart = Math.floor(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)).getTime() / 1000);
        const defaultDateFinal = Math.floor(Date.now() / 1000);

        const start = date.unix(dateStart || null) ?? defaultDateStart;
        const end = date.unix(dateFinal || null) ?? defaultDateFinal;

        const prefixMap: Record<StatisticsTypeId, string> = {
            [StatisticsType.Raw]: 'raw',
            [StatisticsType.Publication]: 'publication',
            [StatisticsType.Visitor]: 'visitor',
            [StatisticsType.HyperlinkClick]: 'hyperlink-click',
        };

        const name = `${prefixMap[typeId]}-data`;

        const payload: GetStatisticsFilePayload = {
            typeId,
            dateStart: start,
            dateFinal: end,
        };

        const { response } = await apiService.request(endpoints.getStatistics)
            .send<GetFileResponse>({ ...payload });

        if (!response) {
            return null;
        }

        return { name, content: response.url };
    }

    return {
        getStatistics,
    };
}
