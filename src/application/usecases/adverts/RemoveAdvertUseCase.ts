import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import AdvertService from 'application/services/api/AdvertService';
import Container from 'infrastructure/services/Container';

export default function RemoveAdvertUseCase(): UseCaseContract<number, Promise<boolean>> {
    const advertService = Container.resolve(AdvertService);

    async function handle(id: number): Promise<boolean> {
        return advertService.removeAdvert(id);
    }

    return {
        handle,
    };
}
