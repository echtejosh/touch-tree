import endpoints from 'infrastructure/routes/endpoints';
import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import { DurationAccessModel } from 'domain/models/DurationAccessModel';

export interface GetDigiTokenTypesResponse {
    digiTokenTypes: Array<{
        id: number;
        dictionary: string,
    }>;
}

export default function DurationAccessService() {
    const apiService = Container.resolve(ApiService);

    async function getTokens(): Promise<DurationAccessModel[] | null> {
        const { digiTokenTypes } = await apiService.request(endpoints.getTokenTypes)
            .send<GetDigiTokenTypesResponse>();

        if (!digiTokenTypes) {
            return null;
        }

        return digiTokenTypes.map((item) => {
            return {
                name: item.dictionary,
                value: item.id,
            };
        });
    }

    return {
        getTokens,
    };
}
