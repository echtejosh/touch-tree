import Container from 'infrastructure/services/Container';
import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import RelationAdvertService from 'application/services/api/relation/RelationAdvertService';

export default function RemoveRelationAdvertUseCase(): UseCaseContract<number, Promise<boolean>> {
    const relationAdvertService = Container.resolve(RelationAdvertService);

    async function handle(id: number): Promise<boolean> {
        return relationAdvertService.removeRelationAdvert(id);
    }

    return {
        handle,
    };
}
