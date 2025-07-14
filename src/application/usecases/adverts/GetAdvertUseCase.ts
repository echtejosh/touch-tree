import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { AdvertModel } from 'domain/models/AdvertModel';
import AdvertService from 'application/services/api/AdvertService';
import Container from 'infrastructure/services/Container';

export default function GetAdvertUseCase(): UseCaseContract<number, Promise<AdvertModel | null>> {
    const advertService = Container.resolve(AdvertService);

    async function handle(id: number): Promise<AdvertModel | null> {
        return advertService.getAdvert(id);
    }

    return {
        handle,
    };
}
