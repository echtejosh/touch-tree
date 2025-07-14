import { useState } from 'react';

interface UseSelectorShape {
    selected: string[];
    isAllSelected: boolean;

    selectAll(): void;

    deselectAll(): void;

    select(id: string): void;

    setSelected(ids: string[]): void;
}

export default function useSelector<T extends { id: string | number }>(items: T[]): UseSelectorShape {
    const [selected, setSelected] = useState<string[]>([]);

    function selectAll(): void {
        setSelected(items.map((item) => item.id.toString()));
    }

    function deselectAll(): void {
        setSelected([]);
    }

    function select(id: string): void {
        setSelected((prev): string[] => {
            if (prev.includes(id)) {
                return prev.filter((itemId): boolean => itemId !== id);
            }

            return [...prev, id];
        });
    }

    return {
        selected,
        isAllSelected: items.length > 0 && selected.length === items.length,
        selectAll,
        deselectAll,
        setSelected,
        select,
    };
}
