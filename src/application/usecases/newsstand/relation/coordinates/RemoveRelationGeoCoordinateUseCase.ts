import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import RelationGeoCoordinateService from 'application/services/api/relation/RelationGeoCoordinateService';

export default function RemoveRelationGeoCoordinateUseCase(): UseCaseContract<number, Promise<boolean>> {
    const relationGeoCoordinateService = Container.resolve(RelationGeoCoordinateService);

    async function handle(id: number): Promise<boolean> {
        return relationGeoCoordinateService.removeGeoCoordinate(id);
    }

    return {
        handle,
    };
}
