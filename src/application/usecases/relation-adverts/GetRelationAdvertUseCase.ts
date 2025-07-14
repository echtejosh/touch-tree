import { RelationAdvertModel } from 'domain/models/RelationAdvertModel';
import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import RelationAdvertService from 'application/services/api/relation/RelationAdvertService';

export default function GetRelationAdvertUseCase(): UseCaseContract<number, Promise<RelationAdvertModel | null>> {
    const relationAdvertService = Container.resolve(RelationAdvertService);

    async function handle(id: number): Promise<RelationAdvertModel | null> {
        return relationAdvertService.getRelationAdvert(id);
    }

    return {
        handle,
    };
}
