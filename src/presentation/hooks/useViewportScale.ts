import { useState, useEffect } from 'react';

export default function useViewportScale(baseLine: number, defaultScale: number = 1) {
    const [scale, setScale] = useState(defaultScale);

    useEffect(() => {
        const calculateScale = () => {
            const viewportHeight = window.innerHeight;
            setScale(viewportHeight / baseLine);
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);

        return () => window.removeEventListener('resize', calculateScale);
    }, [baseLine]);

    return scale;
}
