import Container from 'infrastructure/services/Container';
import RelationIpAddressRepository from 'infrastructure/repositories/RelationIpAddressRepository';
import { RelationIpAddressModel } from 'domain/models/RelationIpAddressModel';
import { ApiResponse } from 'infrastructure/services/types';

export default function RelationIpAddressService() {
    const relationIpAddressRepository = Container.resolve(RelationIpAddressRepository);

    async function getIpAddresses(): Promise<RelationIpAddressModel[] | null> {
        return relationIpAddressRepository.getAll();
    }

    async function getIpAddress(id: number): Promise<RelationIpAddressModel | null> {
        return relationIpAddressRepository.getById(id);
    }

    async function updateIpAddress(values: RelationIpAddressModel): Promise<ApiResponse> {
        return relationIpAddressRepository.update(values);
    }

    async function removeIpAddress(id: number): Promise<boolean> {
        return relationIpAddressRepository.remove(id);
    }

    async function createIpAddress(values: RelationIpAddressModel): Promise<ApiResponse> {
        return relationIpAddressRepository.create(values);
    }

    return {
        getIpAddresses,
        getIpAddress,
        updateIpAddress,
        removeIpAddress,
        createIpAddress,
    };
}
