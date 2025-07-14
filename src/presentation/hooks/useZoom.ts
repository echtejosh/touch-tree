import { RefObject, useCallback, useState } from 'react';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

const MAX_ZOOM = parseFloat(import.meta.env.VITE_MAX_ZOOM || '3');
const MIN_ZOOM = parseFloat(import.meta.env.VITE_MIN_ZOOM || '0.1');

interface ZoomState {
    isMax: boolean;
    isMin: boolean;
}

export default function useZoom(ref: RefObject<ReactZoomPanPinchRef>, initialScale = 1) {
    const [zoomState, setZoomState] = useState<ZoomState>({
        isMax: false,
        isMin: false,
    });

    function checkAndSetZoomState(scale: number) {
        const isMax = scale >= MAX_ZOOM;
        const isMin = scale <= MIN_ZOOM;

        setZoomState({ isMax, isMin });
    }

    const zoom = useCallback((scale: number) => {
        const currentScale = ref.current?.instance.transformState.scale ?? initialScale;
        const newScale = currentScale + scale;
        const clampedScale = Math.min(Math.max(newScale, MIN_ZOOM), MAX_ZOOM);

        checkAndSetZoomState(clampedScale);

        ref.current?.centerView(clampedScale, 0);

        return clampedScale;
    }, [ref, initialScale]);

    return { zoomState, setZoomState, zoom, checkAndSetZoomState };
}
