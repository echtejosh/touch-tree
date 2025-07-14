import React, { useRef, useEffect, useState } from 'react';

import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Box, BoxProps, Button, colors, IconButton, Skeleton } from '@mui/material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import useZoomControls from 'presentation/hooks/useZoomControls';
import { themePalette } from 'presentation/theme';
import { AdjustIcon, CropIcon, ZoomInIcon, ZoomOutIcon } from 'presentation/components/icons';
import { Row } from 'presentation/components/layout';
import { useCrop2 } from 'presentation/hooks/useCrop2';

interface ImagePreviewEditorProps extends BoxProps {
    image: string | null;
    imageScale?: number;
    isEditable?: boolean;
    onSave?: (base64Image: string) => void;
    config: {
        maxZoom: number;
        minZoom: number;
        maxImageWidth: number;
        maxImageHeight: number;
    };
}

export default function PublicationPageImageEditor({
    image: initialImage,
    imageScale = 1,
    isEditable = false,
    config,
    onSave,
    sx,
    ...props
}: ImagePreviewEditorProps): React.ReactElement {
    const ref = useRef<ReactZoomPanPinchRef>(null);
    const [isImageCropped, setIsImageCropped] = useState(false);

    const { maxZoom, minZoom, maxImageWidth, maxImageHeight } = config;

    const {
        zoomState,
        isCentered,
        center,
        handleZoomIn,
        handleZoomOut,
        handleZoomAndPan,
    } = useZoomControls(ref, imageScale);

    const {
        crop,
        image,
        setCrop,
        isCropping,
        openCropView,
        closeCropView,
        submit,
        applyDefaultCrop,
    } = useCrop2({
        defaultValue: initialImage,
        image: null,
        onCrop: setIsImageCropped,
        onSave,
    });

    /**
     *
     */
    function shouldStartCropping(): boolean {
        if (!initialImage || !isEditable) return false;

        return !isImageCropped;
    }

    useEffect(() => {
        const timer = setTimeout(center, 50);

        return () => clearTimeout(timer);
    }, [initialImage, image?.src]);

    useEffect(() => {
        if (shouldStartCropping()) {
            openCropView();
        } else {
            closeCropView();
        }
    }, [initialImage, isImageCropped]);

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
                            onClick={openCropView}
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
                            onClick={closeCropView}
                            sx={{
                                background: colors.common.white,
                                color: 'black',
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submit}
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
                maxScale={maxZoom}
                minScale={minZoom}
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
                            aspect={undefined}
                            {...crop && { crop }}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                        >
                            <img
                                alt='Crop me'
                                onLoad={applyDefaultCrop}
                                src={image?.src || String()}
                                style={{ maxWidth: maxImageWidth, maxHeight: maxImageHeight }}
                            />
                        </ReactCrop>
                    ) : (
                        <Box>
                            {initialImage ? (
                                <Box
                                    alt='publication page image'
                                    component='img'
                                    maxHeight={maxImageHeight}
                                    maxWidth={maxImageWidth}
                                    src={initialImage || String()}
                                />
                            ) : (
                                <Skeleton height={maxImageHeight} variant='rectangular' width={430} />
                            )}
                        </Box>
                    )}
                </TransformComponent>
            </TransformWrapper>
        </Box>
    );
}
