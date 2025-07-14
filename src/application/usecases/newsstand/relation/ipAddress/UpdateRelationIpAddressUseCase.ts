import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { RelationIpAddressModel } from 'domain/models/RelationIpAddressModel';
import RelationIpAddressService from 'application/services/api/relation/RelationIpAddressService';
import { ApiResponse } from 'infrastructure/services/types';

export default function UpdateRelationIpAddressUseCase(): UseCaseContract<Partial<RelationIpAddressModel>, Promise<ApiResponse>> {
    const relationIpAddressService = Container.resolve(RelationIpAddressService);

    async function handle(values: RelationIpAddressModel): Promise<ApiResponse> {
        return relationIpAddressService.updateIpAddress(values);
    }

    return {
        handle,
    };
}
