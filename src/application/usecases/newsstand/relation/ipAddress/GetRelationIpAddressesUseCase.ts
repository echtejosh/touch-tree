import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { RelationIpAddressModel } from 'domain/models/RelationIpAddressModel';
import RelationIpAddressService from 'application/services/api/relation/RelationIpAddressService';

export default function GetRelationIpAddressesUseCase(): UseCaseContract<undefined, Promise<RelationIpAddressModel[] | null>> {
    const relationIpAddressService = Container.resolve(RelationIpAddressService);

    async function handle(): Promise<RelationIpAddressModel[] | null> {
        return relationIpAddressService.getIpAddresses();
    }

    return {
        handle,
    };
}
