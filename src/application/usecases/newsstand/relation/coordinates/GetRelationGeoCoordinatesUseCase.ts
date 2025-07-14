import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import RelationGeoCoordinateService from 'application/services/api/relation/RelationGeoCoordinateService';
import { RelationCoordinateModel } from 'domain/models/RelationCoordinateModel';

export default function GetRelationGeoCoordinatesUseCase(): UseCaseContract<undefined, Promise<RelationCoordinateModel[] | null>> {
    const relationGeoCoordinateService = Container.resolve(RelationGeoCoordinateService);

    async function handle(): Promise<RelationCoordinateModel[] | null> {
        return relationGeoCoordinateService.getGeoCoordinates();
    }

    return {
        handle,
    };
}
