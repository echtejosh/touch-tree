import Container from 'infrastructure/services/Container';
import GamesService from 'application/services/api/GamesService';
import { GameModel } from 'domain/models/GameModel';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';

export default function UpdateGameUseCase(): UseCaseContract<Partial<GameModel>, Promise<boolean>> {
    const gamesService = Container.resolve(GamesService);

    async function handle(values: Partial<GameModel>): Promise<boolean> {
        return gamesService.updateGame(values);
    }

    return {
        handle,
    };
}
