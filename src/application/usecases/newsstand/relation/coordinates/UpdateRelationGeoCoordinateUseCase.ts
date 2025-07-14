import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import RelationGeoCoordinateService from 'application/services/api/relation/RelationGeoCoordinateService';
import { RelationCoordinateModel } from 'domain/models/RelationCoordinateModel';

export default function UpdateRelationGeoCoordinateUseCase(): UseCaseContract<Partial<RelationCoordinateModel>, Promise<boolean>> {
    const relationGeoCoordinateService = Container.resolve(RelationGeoCoordinateService);

    async function handle(values: RelationCoordinateModel): Promise<boolean> {
        return relationGeoCoordinateService.updateGeoCoordinate(values);
    }

    return {
        handle,
    };
}
