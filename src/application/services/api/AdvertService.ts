import Container from 'infrastructure/services/Container';
import { AdvertModel } from 'domain/models/AdvertModel';
import AdvertRepository from 'infrastructure/repositories/AdvertRepository';

export default function AdvertService() {
    const advertRepository = Container.resolve(AdvertRepository);

    async function getAdverts(): Promise<AdvertModel[] | null> {
        return advertRepository.getAll();
    }

    async function getAdvert(id: number): Promise<AdvertModel | null> {
        return advertRepository.getById(id);
    }

    async function updateAdvert(values: AdvertModel): Promise<boolean> {
        return advertRepository.update(values);
    }

    async function removeAdvert(id: number): Promise<boolean> {
        return advertRepository.remove(id);
    }

    async function addAdvert(values: AdvertModel): Promise<boolean> {
        return advertRepository.create(values);
    }

    return {
        getAdverts,
        getAdvert,
        updateAdvert,
        removeAdvert,
        addAdvert,
    };
}
