import Container from 'infrastructure/services/Container';
import HighlightRepository from 'infrastructure/repositories/HighlightRepository';
import { HighlightModel } from 'domain/models/HighlightModel';

export default function HighlightService() {
    const highlightRepository = Container.resolve(HighlightRepository);

    async function getHighlights(): Promise<HighlightModel[] | null> {
        return highlightRepository.getAll();
    }

    async function getHighlight(id: number): Promise<HighlightModel | null> {
        return highlightRepository.getById(id);
    }

    async function updateHighlight(values: HighlightModel): Promise<boolean> {
        return highlightRepository.update(values);
    }

    async function removeHighlight(id: number): Promise<boolean> {
        return highlightRepository.remove(id);
    }

    async function addHighlight(values: HighlightModel): Promise<boolean> {
        return highlightRepository.create(values);
    }

    return {
        getHighlights,
        getHighlight,
        updateHighlight,
        removeHighlight,
        addHighlight,
    };
}
