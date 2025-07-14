import { RelationAdvertModel } from 'domain/models/RelationAdvertModel';
import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import RelationAdvertService from 'application/services/api/relation/RelationAdvertService';

export default function UpdateRelationAdvertUseCase(): UseCaseContract<Partial<RelationAdvertModel>, Promise<boolean>> {
    const relationAdvertService = Container.resolve(RelationAdvertService);

    async function handle(values: RelationAdvertModel): Promise<boolean> {
        return relationAdvertService.updateRelationAdvert(values);
    }

    return {
        handle,
    };
}
