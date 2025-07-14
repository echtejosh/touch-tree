import { useState, useCallback, useRef, SyntheticEvent } from 'react';
import { Crop, makeAspectCrop } from 'react-image-crop';
import img from 'utils/img';

export function useCrop(
    initialImage: string | null,
    image: HTMLImageElement | null,

    /**
     *
     */
    setImage: (image: HTMLImageElement | null) => void,

    /**
     *
     */
    updateIsCropped?: (hasCropped: boolean) => void,

    /**
     *
     */
    onSave?: (base64Image: string) => void,
) {
    const imgRef = useRef<HTMLImageElement | null>(null);

    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState<Crop | null>(null);

    /**
     *
     */
    const onImageLoad = useCallback((event: SyntheticEvent<HTMLImageElement, Event>): void => {
        const { naturalWidth: width, naturalHeight: height } = event.currentTarget;

        const _crop = makeAspectCrop(
            {
                unit: '%',
                width: 100,
            },
            2,
            width,
            height,
        );

        setCrop(_crop);
    }, []);

    /**
     *
     */
    const startCropping = useCallback((): void => {
        if (isCropping) return;

        setImage(img.getImage(initialImage));
        setIsCropping(true);
        updateIsCropped?.(false);
    }, [initialImage, isCropping]);

    /**
     *
     */
    const onCancelCrop = useCallback((): void => {
        setImage(img.getImage(initialImage));
        setIsCropping(false);
    }, [initialImage]);

    /**
     *
     */
    const applyCrop = useCallback((): void => {
        if (!crop || !imgRef.current) {
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const height = (image!.height / 100) * crop.height;
        const width = (image!.width / 100) * crop.width;
        const x = (image!.width / 100) * crop.x;
        const y = (image!.height / 100) * crop.y;

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(
            image as CanvasImageSource,
            x,
            y,
            width,
            height,
            0,
            0,
            width,
            height,
        );

        const imageToSave = canvas.toDataURL('image/jpeg');

        setIsCropping(false);
        setImage(img.getImage(imageToSave));
        onSave?.(imageToSave);
        updateIsCropped?.(true);
    }, [crop, image]);

    return {
        image,
        isCropping,
        crop,
        imgRef,
        setCrop,
        setIsCropping,
        startCropping,
        onImageLoad,
        onCancelCrop,
        applyCrop,
    };
}
