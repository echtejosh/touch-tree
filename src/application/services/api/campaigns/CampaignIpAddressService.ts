import Container from 'infrastructure/services/Container';
import CampaignIpAddressRepository from 'infrastructure/repositories/CampaignIpAddressRepository';
import { CampaignIpAddressModel } from 'domain/models/CampaignIpAddressModel';
import { ApiResponse } from 'infrastructure/services/types';

export default function CampaignIpAddressService() {
    const campaignIpAddressRepository = Container.resolve(CampaignIpAddressRepository);

    async function getIpAddresses(id: number): Promise<CampaignIpAddressModel[] | null> {
        return campaignIpAddressRepository.getAll(id);
    }

    async function getIpAddress(id: number): Promise<CampaignIpAddressModel | null> {
        return campaignIpAddressRepository.getById(id);
    }

    async function updateIpAddress(values: CampaignIpAddressModel): Promise<ApiResponse> {
        return campaignIpAddressRepository.update(values);
    }

    async function removeIpAddress(id: number): Promise<boolean> {
        return campaignIpAddressRepository.remove(id);
    }

    async function createIpAddress(values: CampaignIpAddressModel): Promise<ApiResponse> {
        return campaignIpAddressRepository.create(values);
    }

    return {
        getIpAddresses,
        getIpAddress,
        updateIpAddress,
        removeIpAddress,
        createIpAddress,
    };
}
