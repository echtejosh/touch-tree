import { RelationAdvertModel } from 'domain/models/RelationAdvertModel';
import RelationAdvertRepository from 'infrastructure/repositories/RelationAdvertRepository';
import Container from 'infrastructure/services/Container';

export default class CreateRelationAdvertUseCase {
    static readonly caseName: string = 'CreateRelationAdvertUseCase';

    constructor(
        private relationAdvertRepository = Container.resolve(RelationAdvertRepository),
    ) {}

    async handle(formData: Omit<RelationAdvertModel, 'id' | 'status' | 'linkType' | 'isLocked'>): Promise<boolean> {
        return this.relationAdvertRepository.create({
            ...formData,
            id: 0,
            status: 'draft',
            linkType: 'none',
            isLocked: false,
        });
    }
}
