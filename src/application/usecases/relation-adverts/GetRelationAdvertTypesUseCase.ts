import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import RelationAdvertService from 'application/services/api/relation/RelationAdvertService';
import { RelationAdvertType } from 'domain/models/RelationAdvertModel';

export default function GetRelationAdvertTypesUseCase(): UseCaseContract<undefined, Promise<RelationAdvertType[] | null>> {
    const relationAdvertService = Container.resolve(RelationAdvertService);

    async function handle(): Promise<RelationAdvertType[] | null> {
        return relationAdvertService.getRelationAdvertTypes();
    }

    return {
        handle,
    };
}
