import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import { AdvertModel } from 'domain/models/AdvertModel';
import AdvertService from 'application/services/api/AdvertService';
import Container from 'infrastructure/services/Container';

export default function UpdateAdvertUseCase(): UseCaseContract<Partial<AdvertModel>, Promise<boolean>> {
    const advertService = Container.resolve(AdvertService);

    async function handle(values: AdvertModel): Promise<boolean> {
        return advertService.updateAdvert(values);
    }

    return {
        handle,
    };
}
