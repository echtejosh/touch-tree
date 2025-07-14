import { useEffect, useState } from 'react';

type InteractionShape<T> = {
    name: keyof T;
    value: T[keyof T];
};

export default function useInteraction<T extends Record<string, unknown>>(
    handler?: (values: T) => Promise<unknown>,
    onInteraction?: (interaction: InteractionShape<T>) => void,
) {
    const [interaction, setInteraction] = useState<InteractionShape<T> | null>(null);

    useEffect(() => {
        if (interaction && handler) {
            handler?.({ [interaction.name]: interaction.value } as T).then(() => {
                onInteraction?.(interaction);
            });
        }
    }, [interaction, handler]);

    function _setInteraction<K extends keyof T>(params: { name: K; value: T[K] }) {
        setInteraction(params);
    }

    return {
        interaction,
        setInteraction: _setInteraction,
    } as const;
}
