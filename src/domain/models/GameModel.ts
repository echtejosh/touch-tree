export interface GameModel {
    id: number;
    label: string;
    url: string;
    isLocked: boolean;
    imageUrl: string;
    objectGameSelectedTypes: Array<{
        id: number;
        label: string;
    }>
}
