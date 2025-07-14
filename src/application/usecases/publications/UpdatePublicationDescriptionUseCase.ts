import { UseCaseContract } from 'domain/contracts/usecases/UseCaseContract';
import Container from 'infrastructure/services/Container';
import { PublicationDescriptionModel } from 'domain/models/newsstand/NewsstandPublicationModel';
import NewsstandPublicationService from 'application/services/api/newsstand/NewsstandPublicationService';

export default function UpdatePublicationDescriptionUseCase(): UseCaseContract<PublicationDescriptionModel, Promise<boolean>> {
    const newsstandPublicationService = Container.resolve(NewsstandPublicationService);

    async function handle(values: PublicationDescriptionModel): Promise<boolean> {
        return newsstandPublicationService.updatePublicationDescription(values);
    }

    return {
        handle,
    };
}
