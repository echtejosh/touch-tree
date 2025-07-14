import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import RelationGeoCoordinateService from 'application/services/api/relation/RelationGeoCoordinateService';
import { RelationCoordinateModel } from 'domain/models/RelationCoordinateModel';

export default function GetRelationGeoCoordinateUseCase(): UseCaseContract<number, Promise<RelationCoordinateModel | null>> {
    const relationGeoCoordinateService = Container.resolve(RelationGeoCoordinateService);

    async function handle(id: number): Promise<RelationCoordinateModel | null> {
        return relationGeoCoordinateService.getGeoCoordinate(id);
    }
    return {
        handle,
    };
}
