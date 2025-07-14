import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import RelationIpAddressService from 'application/services/api/relation/RelationIpAddressService';

export default function RemoveRelationIpAddressUseCase(): UseCaseContract<number, Promise<boolean>> {
    const relationIpAddressService = Container.resolve(RelationIpAddressService);

    async function handle(id: number): Promise<boolean> {
        return relationIpAddressService.removeIpAddress(id);
    }

    return {
        handle,
    };
}
