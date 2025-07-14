import Container from 'infrastructure/services/Container';
import { ApiService } from 'infrastructure/services';
import endpoints from 'infrastructure/routes/endpoints';
import { GameModel } from 'domain/models/GameModel';
import { ApiResponse } from 'infrastructure/services/types';

interface GetGamesResponse {
    digiGames: {
        listing: Array<{
            id: number;
            label: string;
            isLocked: boolean;
            objectGameSelectedTypes: Array<{
                id: number;
                label: string;
            }>
            url: string;
            imageUrl: string;
        }>;
        types: Array<{
            id: number;
            label: string;
        }>
    };
}

interface GetGameResponse {
    digiGame: {
        id: number;
        label: string;
        isLocked: boolean;
        objectGameSelectedTypes: Array<{
            id: number;
            label: string;
        }>
        url: string;
        imageUrl: string;
    };
}

export default function GamesService() {
    const apiService = Container.resolve(ApiService);

    async function getGames(): Promise<GameModel[] | null> {
        const { digiGames } = await apiService.request(endpoints.getGames)
            .send<GetGamesResponse>();

        if (!digiGames.listing) {
            return null;
        }

        return digiGames.listing;
    }

    async function getGame(id: number): Promise<GameModel | null> {
        const { digiGame } = await apiService.request(endpoints.getGame)
            .send<GetGameResponse>({ gameId: id });

        if (!digiGame) {
            return null;
        }

        return digiGame;
    }

    async function getCategories(): Promise<Array<{
        id: number;
        label: string;
    }> | null> {
        const { digiGames } = await apiService.request(endpoints.getGames)
            .send<GetGamesResponse>();

        if (!digiGames.types) {
            return null;
        }

        return digiGames.types;
    }

    async function updateGame(values: Partial<GameModel>): Promise<boolean> {
        const { success } = await apiService.request(endpoints.updateGame)
            .send<ApiResponse>({
                gameId: values.id,
                isLocked: values.isLocked,
            });

        return success || false;
    }

    return {
        getGame,
        getGames,
        getCategories,
        updateGame,
    };
}
