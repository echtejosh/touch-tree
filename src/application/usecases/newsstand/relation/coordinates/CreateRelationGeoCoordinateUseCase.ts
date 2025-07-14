import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { RelationCoordinateModel } from 'domain/models/RelationCoordinateModel';
import RelationGeoCoordinateService from 'application/services/api/relation/RelationGeoCoordinateService';

export default function CreateRelationGeoCoordinateUseCase(): UseCaseContract<RelationCoordinateModel, Promise<boolean>> {
    const relationGeoCoordinateService = Container.resolve(RelationGeoCoordinateService);

    async function handle(values: RelationCoordinateModel): Promise<boolean> {
        return relationGeoCoordinateService.createGeoCoordinate(values);
    }

    return {
        handle,
    };
}
