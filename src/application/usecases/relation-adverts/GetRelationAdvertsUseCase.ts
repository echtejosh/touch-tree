import { RelationAdvertModel } from 'domain/models/RelationAdvertModel';
import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import RelationAdvertService from 'application/services/api/relation/RelationAdvertService';

export default function GetRelationAdvertsUseCase(): UseCaseContract<undefined, Promise<RelationAdvertModel[] | null>> {
    const relationAdvertService = Container.resolve(RelationAdvertService);

    async function handle(): Promise<RelationAdvertModel[] | null> {
        return relationAdvertService.getRelationAdverts();
    }

    return {
        handle,
    };
}
