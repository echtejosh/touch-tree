import React, { useRef, useState, useEffect, SyntheticEvent, useMemo } from 'react';
import useZoom from 'presentation/hooks/useZoom';
import { Box, Row } from 'presentation/components/layout';
import { themePalette } from 'presentation/theme';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { AdjustIcon, CropIcon, ZoomInIcon, ZoomOutIcon } from 'presentation/components/icons';
import { BoxProps, Button, colors, IconButton, Skeleton } from '@mui/material';
import ReactCrop, { Crop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const MAX_ZOOM = parseFloat(import.meta.env.VITE_MAX_ZOOM || '3');
const MIN_ZOOM = parseFloat(import.meta.env.VITE_MIN_ZOOM || '0.1');
const ZOOM_STEP = parseFloat(import.meta.env.VITE_ZOOM_STEP || '0.1');

const MAX_IMAGE_WIDTH = 500;
const MAX_IMAGE_HEIGHT = 600;

interface ImagePreviewEditorProps extends BoxProps {
    image: string | null;
    isEditable?: boolean;
    imageScale?: number;
    onCropStatusChange?: (hasCropped: boolean) => void;
    onSave?: (base64Image: string) => void;
}

export default function ImagePreviewEditor({
    image: initialImage,
    imageScale = 1,
    isEditable = false,
    onCropStatusChange,
    onSave,
    sx,
    ...props
}: ImagePreviewEditorProps): React.ReactElement {
    const ref = useRef<ReactZoomPanPinchRef>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const initImg = new Image();
    initImg.src = initialImage || String();

    const [image, setImage] = useState<HTMLImageElement | null>(initImg);
    const [isCentered, setIsCentered] = useState(true);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState<Crop | null>(null);

    const { zoomState, setZoomState, zoom, checkAndSetZoomState } = useZoom(ref, imageScale);

    const isAspectRatioTwoToOne = useMemo(() => {
        if (!image || !image.width || !image.height) {
            return false;
        }
        const aspectRatio = image.width / image.height;
        return Math.abs(aspectRatio - 2) <= 0.02;
    }, [image?.width, image?.height]);

    function getImage(src: string | null) {
        const temp = new Image();
        temp.src = src || String();
        return temp;
    }

    function center(): void {
        ref.current?.centerView(imageScale);

        setIsCentered(true);
        setZoomState({ isMax: false, isMin: false });
    }

    function handleZoomIn() {
        zoom(ZOOM_STEP);
        setIsCentered(false);
    }

    function handleZoomOut() {
        zoom(-ZOOM_STEP);
        setIsCentered(false);
    }

    function handleZoomAndPan() {
        checkAndSetZoomState(ref.current?.instance.transformState.scale ?? imageScale);
        setIsCentered(false);
    }

    function startCropping(): void {
        if (isCropping) return;

        const img = getImage(initialImage as string);

        setImage(img);
        setIsCropping(true);
        onCropStatusChange?.(false);
    }

    function onImageLoad(event: SyntheticEvent<HTMLImageElement, Event>) {
        const {
            naturalWidth: width,
            naturalHeight: height,
        } = event.currentTarget;

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
    }

    function onCancelCrop(): void {
        const img = getImage(initialImage);

        setImage(img);
        setIsCropping(false);
    }

    function applyCrop(): void {
        if (!crop || !canvasRef.current || !imgRef.current) {
            return;
        }

        const canvas = canvasRef.current;
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

        const img = getImage(canvas.toDataURL('image/jpeg'));

        setImage(img);
        setIsCropping(false);
        onCropStatusChange?.(true);
        onSave?.(img.src);
    }

    useEffect(() => {
        const img = getImage(initialImage);

        setImage(img);
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
                                    src={image?.src || String()}
                                />
                            ) : (
                                <Skeleton height={MAX_IMAGE_HEIGHT} variant='rectangular' width={430} />
                            )}
                        </Box>
                    )}
                </TransformComponent>
            </TransformWrapper>

            <canvas
                ref={canvasRef}
                style={{
                    display: 'none',
                }}
            />
        </Box>
    );
}
