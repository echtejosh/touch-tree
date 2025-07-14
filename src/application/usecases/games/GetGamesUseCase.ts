import Container from 'infrastructure/services/Container';
import GamesService from 'application/services/api/GamesService';

export default function GetGamesUseCase() {
    const gamesService = Container.resolve(GamesService);

    async function handle() {
        return gamesService.getGames();
    }

    return {
        handle,
    };
}
