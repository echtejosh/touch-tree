import React, { useRef, useEffect, useState, ReactElement } from 'react';

import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Box, BoxProps, CircularProgress, colors, IconButton, Skeleton } from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import useZoomControls from 'presentation/hooks/useZoomControls';
import { themePalette } from 'presentation/theme';
import { AdjustIcon, ZoomInIcon, ZoomOutIcon } from 'presentation/components/icons';
import { Row } from 'presentation/components/layout';
import GetPublicationInteractionsUseCase from 'application/usecases/publications/GetPublicationInteractionsUseCase';
import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import GetPublicationPageUseCase from 'application/usecases/publications/GetPublicationPageUseCase';
import { styled } from '@mui/styles';
import { PublicationInteraction } from 'domain/models/PublicationInteraction';
import { useCrop2 } from 'presentation/hooks/useCrop2';

const MAX_ZOOM = parseFloat(import.meta.env.VITE_MAX_ZOOM || '3');
const MIN_ZOOM = parseFloat(import.meta.env.VITE_MIN_ZOOM || '0.1');

const MAX_IMAGE_WIDTH = 500;
const MAX_IMAGE_HEIGHT = 600;

const StyledReactCrop = styled(ReactCrop)({
    '& .ReactCrop__crop-selection': {
        zIndex: 2,
    },
});

export const InteractionTypes = {
    Add: 0,
    Edit: 1,
} as const;

type InteractionType = typeof InteractionTypes[keyof typeof InteractionTypes];

export interface CropEdges {
    percentageTop: number,
    percentageBottom: number,
    percentageLeft: number,
    percentageRight: number,
}

interface InteractionsImagePreviewProps extends BoxProps {
    page: number | null;
    publicationId: number;
    publicationType?: InteractionType;
    imageScale?: number;
    cropArea?: CropEdges | null;
    onCropChange?: (cropEdges: CropEdges) => void;
}

export default function PublicationInteractionImagePreview({
    publicationType = InteractionTypes.Add,
    imageScale = 1,
    page,
    publicationId,
    cropArea,
    onCropChange,
    sx,
    ...props
}: InteractionsImagePreviewProps): ReactElement {
    const getPublicationInteractionsUseCase = Container.resolve(GetPublicationInteractionsUseCase);
    const getPublicationPageUseCase = Container.resolve(GetPublicationPageUseCase);

    const ref = useRef<ReactZoomPanPinchRef>(null);
    const [isLoading, setIsLoading] = useState(publicationType === InteractionTypes.Edit);

    const { data: publicationInteractions } = useQuery(
        () => getPublicationInteractionsUseCase.handle({
            id: publicationId,
            page: page ?? -1, // need to give page id else null won't be returned
        }),
        [GetPublicationInteractionsUseCase.name, publicationId, page],
    );

    const { data: publicationPage } = useQuery(
        () => getPublicationPageUseCase.handle({
            linkedPage: page,
            linkedArticleId: publicationId,
        }),
        [GetPublicationPageUseCase.name, page, publicationId],
    );

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
        setCrop,
        image,
        openCropView,
        isCropping,
    } = useCrop2({
        defaultValue: publicationPage?.imageData || null,
        image: null,
    });

    useEffect(() => {
        openCropView();

        if (cropArea) {
            setCrop({
                unit: '%',
                width: cropArea.percentageRight - cropArea.percentageLeft,
                height: cropArea.percentageBottom - cropArea.percentageTop,
                x: cropArea.percentageLeft,
                y: cropArea.percentageTop,
            });

            setIsLoading(false);
        }
    }, [cropArea]);

    const filterInteractions = (interactions: PublicationInteraction[] | null, _cropArea: CropEdges | null) => {
        if (!_cropArea) {
            return interactions;
        }

        return interactions?.filter((int) => {
            return !(int.percentageTop === _cropArea?.percentageTop && int.percentageLeft === _cropArea?.percentageLeft);
        });
    };

    function handleCropChange(_crop: Crop | null) {
        if (!_crop) {
            return;
        }

        const { x, y, width, height } = _crop;

        const cropEdges = {
            percentageTop: y,
            percentageBottom: y + height,
            percentageLeft: x,
            percentageRight: x + width,
        };

        onCropChange?.(cropEdges);
    }

    useEffect(() => {
        const timer = setTimeout(center, 50);

        return () => clearTimeout(timer);
    }, [publicationPage?.imageData, image?.src]);

    useEffect(() => {
        if (crop?.width) {
            handleCropChange(crop);
        }
    }, [crop]);

    const renderImageOrSkeleton = () => {
        if (publicationPage?.imageData) {
            return (
                <Box
                    alt='publication page image'
                    component='img'
                    maxHeight={MAX_IMAGE_HEIGHT}
                    maxWidth={MAX_IMAGE_WIDTH}
                    src={publicationPage?.imageData || String()}
                />
            );
        }
        return <Skeleton height={MAX_IMAGE_HEIGHT} variant='rectangular' width={430} />;
    };

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
                    <Box position='relative'>

                        {isCropping ? (
                            <StyledReactCrop
                                aspect={undefined}
                                {...crop && { crop }}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                            >
                                {filterInteractions(publicationInteractions?.interactions || null, cropArea || null)?.map((int) => (
                                    <Box
                                        key={int.id}
                                        height={`${int.percentageBottom - int.percentageTop}%`}
                                        left={`${int.percentageLeft}%`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        position='absolute'
                                        sx={{
                                            background: 'rgb(217,217,217, 0.4)',
                                            border: '1px solid #D9D9D9',
                                            zIndex: 1,
                                        }}
                                        top={`${int.percentageTop}%`}
                                        width={`${int.percentageRight - int.percentageLeft}%`}
                                    />
                                ))}
                                <Box display='inline-block' position='relative'>
                                    <img
                                        alt='Select me'
                                        src={image?.src || String()}
                                        style={{
                                            maxWidth: MAX_IMAGE_WIDTH,
                                            maxHeight: MAX_IMAGE_HEIGHT,
                                            opacity: isLoading ? 0.5 : 1,
                                            transition: 'opacity 0.3s ease-in-out',
                                        }}
                                    />
                                    {isLoading && (
                                        <Box
                                            left='50%'
                                            position='absolute'
                                            sx={{ transform: 'translate(-50%, -50%)', zIndex: 10 }}
                                            top='50%'
                                        >
                                            <CircularProgress />
                                        </Box>
                                    )}
                                </Box>
                            </StyledReactCrop>
                        ) : (
                            renderImageOrSkeleton()
                        )}
                    </Box>
                </TransformComponent>
            </TransformWrapper>
        </Box>
    );
}
