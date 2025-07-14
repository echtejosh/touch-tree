import Container from 'infrastructure/services/Container';
import RelationGeoCoordinateRepository from 'infrastructure/repositories/RelationGeoCoordinateRepository';
import { RelationCoordinateModel } from 'domain/models/RelationCoordinateModel';

export default function RelationGeoCoordinateService() {
    const relationGeoCoordinateRepository = Container.resolve(RelationGeoCoordinateRepository);

    async function getGeoCoordinates(): Promise<RelationCoordinateModel[] | null> {
        return relationGeoCoordinateRepository.getAll();
    }

    async function getGeoCoordinate(id: number): Promise<RelationCoordinateModel | null> {
        return relationGeoCoordinateRepository.getById(id);
    }

    async function updateGeoCoordinate(values: RelationCoordinateModel): Promise<boolean> {
        return relationGeoCoordinateRepository.update(values);
    }

    async function removeGeoCoordinate(id: number): Promise<boolean> {
        return relationGeoCoordinateRepository.remove(id);
    }

    async function createGeoCoordinate(values: RelationCoordinateModel): Promise<boolean> {
        return relationGeoCoordinateRepository.create(values);
    }

    return {
        getGeoCoordinates,
        getGeoCoordinate,
        updateGeoCoordinate,
        removeGeoCoordinate,
        createGeoCoordinate,
    };
}
