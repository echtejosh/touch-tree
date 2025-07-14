import { useState } from 'react';

interface UseRefreshReturnType {
    refreshContent: boolean;
    triggerRefresh: () => void;
}

export default function useRefresh(id: string): UseRefreshReturnType {
    const [refreshStates, setRefreshStates] = useState<{ [key: string]: boolean }>({});

    /**
     *
     * @param _id
     */
    function getRefreshState(_id: string): boolean {
        return refreshStates[_id] || false;
    }

    /**
     *
     * @param _id
     */
    function triggerRefresh(_id: string): void {
        setRefreshStates((prev) => ({
            ...prev,
            [_id]: !prev[_id],
        }));
    }

    return {
        refreshContent: getRefreshState(id),
        triggerRefresh: () => triggerRefresh(id),
    };
}
