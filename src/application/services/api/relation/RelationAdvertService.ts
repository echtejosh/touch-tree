import Container from 'infrastructure/services/Container';
import { RelationAdvertModel, RelationAdvertType } from 'domain/models/RelationAdvertModel';
import RelationAdvertRepository from 'infrastructure/repositories/RelationAdvertRepository';
import endpoints from 'infrastructure/routes/endpoints';
import { ApiService } from 'infrastructure/services';

export default function RelationAdvertService() {
    const apiService = Container.resolve(ApiService);
    const relationAdvertRepository = Container.resolve(RelationAdvertRepository);

    async function getRelationAdverts(): Promise<RelationAdvertModel[] | null> {
        return relationAdvertRepository.getAll();
    }

    async function getRelationAdvert(id: number): Promise<RelationAdvertModel | null> {
        return relationAdvertRepository.getById(id);
    }

    async function updateRelationAdvert(values: RelationAdvertModel): Promise<boolean> {
        return relationAdvertRepository.update(values);
    }

    async function removeRelationAdvert(id: number): Promise<boolean> {
        return relationAdvertRepository.remove(id);
    }

    async function addRelationAdvert(values: RelationAdvertModel): Promise<boolean> {
        return relationAdvertRepository.create(values);
    }

    async function getRelationAdvertTypes(): Promise<RelationAdvertType[] | null> {
        const response = await apiService.request(endpoints.getRelationAdvertTypes)
            .send<{ digiAdvertTypes: RelationAdvertType[] }>();

        return response?.digiAdvertTypes || null;
    }

    return {
        getRelationAdverts,
        getRelationAdvert,
        updateRelationAdvert,
        removeRelationAdvert,
        addRelationAdvert,
        getRelationAdvertTypes,
    };
}
