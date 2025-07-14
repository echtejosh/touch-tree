import { useState, useCallback, RefObject } from 'react';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import useZoom from 'presentation/hooks/useZoom';

/**
 *
 * @param ref
 * @param imageScale
 */
export default function useZoomControls(
    ref: RefObject<ReactZoomPanPinchRef>,
    imageScale: number,
) {
    const { zoomState, setZoomState, zoom, checkAndSetZoomState } = useZoom(ref, imageScale);

    const [isCentered, setIsCentered] = useState(false);
    const ZOOM_STEP = 0.1;

    /**
     *
     */
    const center = useCallback((): void => {
        ref.current?.centerView(imageScale);
        setIsCentered(true);
        setZoomState({ isMax: false, isMin: false });
    }, [ref, imageScale]);

    /**
     *
     */
    const handleZoomIn = useCallback((): void => {
        zoom(ZOOM_STEP);
        setIsCentered(false);
    }, [ZOOM_STEP]);

    /**
     *
     */
    const handleZoomOut = useCallback((): void => {
        zoom(-ZOOM_STEP);
        setIsCentered(false);
    }, [ZOOM_STEP]);

    /**
     *
     */
    const handleZoomAndPan = useCallback((): void => {
        const scale = ref.current?.instance.transformState.scale ?? imageScale;
        checkAndSetZoomState(scale);
        setIsCentered(false);
    }, [imageScale, ref]);

    return {
        zoomState,
        setZoomState,
        zoom,
        checkAndSetZoomState,
        isCentered,
        center,
        handleZoomIn,
        handleZoomOut,
        handleZoomAndPan,
    };
}
