import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { AdvertModel } from 'domain/models/AdvertModel';
import AdvertService from 'application/services/api/AdvertService';
import Container from 'infrastructure/services/Container';

export default function GetAdvertsUseCase(): UseCaseContract<undefined, Promise<AdvertModel[] | null>> {
    const advertService = Container.resolve(AdvertService);

    async function handle(): Promise<AdvertModel[] | null> {
        return advertService.getAdverts();
    }

    return {
        handle,
    };
}
