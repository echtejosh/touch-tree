import React, { useRef, useEffect, useMemo, useState } from 'react';

import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Box, BoxProps, Button, colors, IconButton, Skeleton } from '@mui/material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import useZoomControls from 'presentation/hooks/useZoomControls';
import { useCrop } from 'presentation/hooks/useCrop';
import img from 'utils/img';
import { themePalette } from 'presentation/theme';
import { AdjustIcon, CropIcon, ZoomInIcon, ZoomOutIcon } from 'presentation/components/icons';
import { Row } from 'presentation/components/layout';

const MAX_ZOOM = parseFloat(import.meta.env.VITE_MAX_ZOOM || '3');
const MIN_ZOOM = parseFloat(import.meta.env.VITE_MIN_ZOOM || '0.1');

const MAX_IMAGE_WIDTH = 500;
const MAX_IMAGE_HEIGHT = 600;

interface ImagePreviewEditorProps extends BoxProps {
    image: string | null;
    isEditable?: boolean;
    imageScale?: number;
    onCropStatusChange?: (hasCropped: boolean) => void;
    onSave?: (base64Image: string) => void;
}

export default function EditorImagePreview({
    image: initialImage,
    imageScale = 1,
    isEditable = false,
    onCropStatusChange,
    onSave,
    sx,
    ...props
}: ImagePreviewEditorProps): React.ReactElement {
    const ref = useRef<ReactZoomPanPinchRef>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const {
        zoomState,
        isCentered,
        center,
        handleZoomIn,
        handleZoomOut,
        handleZoomAndPan,
    } = useZoomControls(ref, imageScale);

    const {
        isCropping,
        crop,
        imgRef,
        setCrop,
        setIsCropping,
        startCropping,
        onImageLoad,
        onCancelCrop,
        applyCrop,
    } = useCrop(initialImage, image, setImage, onCropStatusChange, onSave);

    /**
     *
     */
    const isAspectRatioTwoToOne = useMemo((): boolean => {
        if (!image || !image.width || !image.height) {
            return false;
        }
        const aspectRatio = image.width / image.height;
        return Math.abs(aspectRatio - 2) <= 0.02;
    }, [image?.width, image?.height]);

    useEffect(() => {
        setImage(img.getImage(initialImage));
    }, [initialImage]);

    useEffect(() => {
        const timer = setTimeout(center, 50);

        return () => clearTimeout(timer);
    }, [initialImage, image?.src]);

    useEffect(() => {
        if (initialImage && !isAspectRatioTwoToOne && isEditable) {
            startCropping();
        } else {
            setIsCropping(false);
            onCropStatusChange?.(true);
        }
    }, [initialImage, isAspectRatioTwoToOne]);

    return (
        <Box
            flex={1}
            gap={0}
            sx={{
                background: themePalette.background.light,
                position: 'relative',
                ...sx,
            }}
            {...props}
        >
            {isEditable && (
                <Row
                    gap={1}
                    m={2}
                    sx={{
                        position: 'absolute',
                        left: 0,
                    }}
                    zIndex={100}
                >
                    <Box
                        sx={{
                            background: colors.common.white,
                            borderRadius: 1,
                        }}
                    >
                        <IconButton
                            disabled={!image?.src}
                            onClick={startCropping}
                            sx={{ color: themePalette.icon.main }}
                        >
                            <CropIcon />
                        </IconButton>
                    </Box>
                </Row>
            )}

            <Row
                gap={0}
                position='absolute'
                sx={{
                    right: 0,
                    m: 2,
                    zIndex: 100,
                    background: colors.common.white,
                    borderRadius: 1,
                }}
            >
                <IconButton
                    disabled={zoomState.isMax}
                    onClick={handleZoomIn}
                    sx={{
                        color: themePalette.icon.main,
                    }}
                >
                    <ZoomInIcon />
                </IconButton>

                <IconButton
                    disabled={zoomState.isMin}
                    onClick={handleZoomOut}
                    sx={{
                        color: themePalette.icon.main,
                    }}
                >
                    <ZoomOutIcon />
                </IconButton>

                <Box>
                    <IconButton
                        onClick={center}
                        sx={{ color: isCentered ? themePalette.icon.light : themePalette.icon.main }}
                    >
                        <AdjustIcon />
                    </IconButton>
                </Box>
            </Row>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    m: 2,
                    zIndex: 100,
                }}
            >
                {isCropping && (
                    <Row gap={1}>
                        <Button
                            onClick={onCancelCrop}
                            sx={{
                                background: colors.common.white,
                                color: 'black',
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={applyCrop}
                            sx={{
                                background: colors.common.white,
                            }}
                        >
                            Save
                        </Button>
                    </Row>
                )}
            </Box>

            <TransformWrapper
                ref={ref}
                centerOnInit
                initialScale={imageScale}
                maxScale={MAX_ZOOM}
                minScale={MIN_ZOOM}
                onPanning={handleZoomAndPan}
                onZoom={handleZoomAndPan}
            >
                <TransformComponent
                    wrapperStyle={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                    }}
                >
                    {isCropping ? (
                        <ReactCrop
                            aspect={2}
                            {...crop && { crop }}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                        >
                            <img
                                ref={imgRef}
                                alt='Crop me'
                                onLoad={onImageLoad}
                                src={image?.src || String()}
                                style={{ maxWidth: MAX_IMAGE_WIDTH, maxHeight: MAX_IMAGE_HEIGHT }}
                            />
                        </ReactCrop>
                    ) : (
                        <Box>
                            {initialImage ? (
                                <Box
                                    alt='publication page image'
                                    component='img'
                                    maxHeight={MAX_IMAGE_HEIGHT}
                                    maxWidth={MAX_IMAGE_WIDTH}
                                    src={initialImage || String()}
                                />
                            ) : (
                                <Skeleton height={MAX_IMAGE_HEIGHT} variant='rectangular' width={430} />
                            )}
                        </Box>
                    )}
                </TransformComponent>
            </TransformWrapper>
        </Box>
    );
}
