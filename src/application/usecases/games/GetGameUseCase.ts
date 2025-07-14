import Container from 'infrastructure/services/Container';
import GamesService from 'application/services/api/GamesService';

export default function GetGameUseCase() {
    const gamesService = Container.resolve(GamesService);

    async function handle(id: number) {
        return gamesService.getGame(id);
    }

    return {
        handle,
    };
}
