import Container from 'infrastructure/services/Container';
import GamesService from 'application/services/api/GamesService';

export default function GetGameCategoriesUseCase() {
    const gamesService = Container.resolve(GamesService);

    async function handle() {
        return gamesService.getCategories();
    }

    return {
        handle,
    };
}
