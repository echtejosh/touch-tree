import { Crop, makeAspectCrop } from 'react-image-crop';
import { useEffect, useMemo, useState } from 'react';

/**
 *
 */
export type ImageShape = HTMLImageElement | null;

/**
 *
 */
export interface UseCrop2Props {
    /**
     *
     * @param state
     */
    onCrop(state: boolean): void;

    /**
     *
     * @param value
     */
    onSave(value: string): void;
}

/**
 *
 */
export interface UseCropProps {
    /**
     *
     */
    defaultValue: string | null;

    /**
     *
     */
    image: ImageShape;
}

/**
 * Hook for cropping images.
 *
 * @constructor
 */
export function useCrop2({
    defaultValue,
    image: _image,
    onSave,
    onCrop,
}: UseCropProps & Partial<UseCrop2Props>) {
    const [image, setImage] = useState<ImageShape>(_image);
    const [crop, setCrop] = useState<Crop | null>(null);

    /**
     * Keep track of when the crop view is used or  not.
     */
    const [isCropping, setIsCropping] = useState(false);

    /**
     * Converts image data to an image object.
     *
     * @param value
     */
    function _convertToImage(value: string | null): ImageShape {
        const img = new Image();

        img.src = value || String();

        return img;
    }

    /**
     * Sets an image data as a component of image internally.
     *
     * @param value
     */
    function _setImageDataAsImage(value: string | null) {
        const img = _convertToImage(value);

        setImage(img);
    }

    /**
     * Apply a default crop area based on the aspect ratio.
     *
     * This function applies a default crop area for when someone wants to start cropping.
     */
    function applyDefaultCrop(): void {
        const aspectCrop: Crop = makeAspectCrop(
            {
                unit: '%',
                width: 100,
            },
            2,
            image?.naturalWidth || 0,
            image?.naturalHeight || 0,
        );

        setCrop(aspectCrop);
    }

    /**
     * Open the crop view.
     */
    function openCropView(): void {
        if (isCropping) {
            return;
        }

        _setImageDataAsImage(defaultValue);
        setIsCropping(true);
        onCrop?.(false);
    }

    /**
     * Close the crop view.
     */
    function closeCropView(): void {
        _setImageDataAsImage(defaultValue);
        setIsCropping(false);
    }

    /**
     * Submit the cropped image.
     */
    function submit(): void {
        if (!crop || !image) {
            return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const height = (image.height / 100) * crop.height;
        const width = (image.width / 100) * crop.width;
        const x = (image.width / 100) * crop.x;
        const y = (image.height / 100) * crop.y;

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
        setImage(_convertToImage(imageToSave));
        onSave?.(imageToSave);
        onCrop?.(true);
    }

    useEffect(() => {
        _setImageDataAsImage(defaultValue);
    }, [defaultValue]);

    return {
        setImage,
        setCrop,
        image,
        applyDefaultCrop,
        openCropView,
        closeCropView,
        crop: useMemo(() => crop, [crop]),
        submit,
        isCropping,
    };
}
