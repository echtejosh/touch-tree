import React, { useRef, useEffect, useMemo, useState } from 'react';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Box, BoxProps, Button, colors, IconButton, Skeleton, Popper, Paper, ClickAwayListener } from '@mui/material';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import useZoomControls from 'presentation/hooks/useZoomControls';
import { useCrop } from 'presentation/hooks/useCrop';
import img from 'utils/img';
import { themePalette } from 'presentation/theme';
import { AddIcon, AdjustIcon, CropIcon, ZoomInIcon, ZoomOutIcon } from 'presentation/components/icons';
import { Column, Row } from 'presentation/components/layout';
import GetPublicationInteractionsUseCase from 'application/usecases/publications/GetPublicationInteractionsUseCase';
import Container from 'infrastructure/services/Container';
import { useInvalidateQuery, useQuery } from 'presentation/hooks';
import GetPublicationPageUseCase from 'application/usecases/publications/GetPublicationPageUseCase';
import CreatePublicationInteractionDialog from 'presentation/modals/publications/CreatePublicationInteractionDialog';
import useDialog from 'presentation/hooks/useDialog';
import { ButtonPaperItem } from 'presentation/components/buttons';
import UpdatePublicationInteractionDialog from 'presentation/modals/publications/UpdatePublicationInteractionDialog';
import Preload from 'presentation/components/preload/Preload';
import GetPublicationInteractionUseCase from 'application/usecases/publications/GetPublicationInteractionUseCase';
import usePrefetchQueryDecorator from 'presentation/hooks/decorators/usePrefetchQueryDecorator';
import DeletePublicationInteractionModal from 'presentation/modals/publications/DeletePublicationInteractionModal';

const MAX_ZOOM = parseFloat(import.meta.env.VITE_MAX_ZOOM || '3');
const MIN_ZOOM = parseFloat(import.meta.env.VITE_MIN_ZOOM || '0.1');

const MAX_IMAGE_WIDTH = 500;
const MAX_IMAGE_HEIGHT = 600;

interface InteractionsImagePreviewProps extends BoxProps {
    pageId: number | null;
    page: number | null;
    publicationId: number;
    isEditable?: boolean;
    imageScale?: number;
    onCropStatusChange?: (hasCropped: boolean) => void;
    onSave?: (base64Image: string) => void;
}

export default function InteractionsImagePreview({
    imageScale = 1,
    isEditable = false,
    onCropStatusChange,
    pageId,
    page,
    publicationId,
    onSave,
    sx,
    ...props
}: InteractionsImagePreviewProps): React.ReactElement {
    const getPublicationInteractionUseCase = Container.resolve(GetPublicationInteractionUseCase);
    const getPublicationInteractionsUseCase = Container.resolve(GetPublicationInteractionsUseCase);
    const getPublicationPageUseCase = Container.resolve(GetPublicationPageUseCase);

    const ref = useRef<ReactZoomPanPinchRef>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    // State for Popper anchor element
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const closePopover = () => {
        setAnchorEl(null);
    };

    const [currentInteraction, setCurrentInteraction] = useState<null | number>(null);

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

    const { createDialog } = useDialog();

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
    } = useCrop(publicationPage?.imageData || String(), image, setImage, onCropStatusChange, onSave);

    /**
     * Determine if image is close to a 2:1 aspect ratio
     */
    const isAspectRatioTwoToOne = useMemo((): boolean => {
        if (!image || !image.width || !image.height) {
            return false;
        }
        const aspectRatio = image.width / image.height;
        return Math.abs(aspectRatio - 2) <= 0.02;
    }, [image?.width, image?.height]);

    /**
     *
     */
    function openAddPublicationInteractionDialog() {
        createDialog((_props) => (
            <CreatePublicationInteractionDialog
                page={page}
                pageId={pageId}
                publicationId={publicationId}
                {..._props}
            />
        ))
            .open({
                maxWidth: 'lg',
            });
    }

    function openEditPublicationInteractionDialog(id: number | null) {
        if (id) {
            createDialog((_props) => (
                <UpdatePublicationInteractionDialog
                    interactionId={id}
                    page={page}
                    publicationId={publicationId}
                    {..._props}
                />
            )).open({
                maxWidth: 'lg',
            });
        }
    }

    async function openDeletePublicationInteractionDialog(id: number | null) {
        if (id) {
            const { open } = createDialog((_props) => <DeletePublicationInteractionModal id={id} {..._props} />);
            useInvalidateQuery([GetPublicationInteractionsUseCase.name, publicationId, page]);

            open();
        }
    }

    // New handler to open the popper with "Hello World"
    const handleEffectAreaClick = (id: number, event: React.MouseEvent<HTMLDivElement>) => {
        setCurrentInteraction(id);
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        setImage(img.getImage(publicationPage?.imageData || String()));
    }, [publicationPage?.imageData]);

    useEffect(() => {
        const timer = setTimeout(center, 50);

        return () => clearTimeout(timer);
    }, [publicationPage?.imageData, image?.src]);

    useEffect(() => {
        if (publicationPage?.imageData && !isAspectRatioTwoToOne && isEditable) {
            startCropping();
        } else {
            setIsCropping(false);
            onCropStatusChange?.(true);
        }
    }, [publicationPage?.imageData, isAspectRatioTwoToOne]);

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
                    left: 0,
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
                    right: 0,
                    m: 2,
                    zIndex: 100,
                }}
            >
                <Button
                    onClick={openAddPublicationInteractionDialog}
                    startIcon={<AddIcon />}
                    variant='contained'
                >
                    Add interaction
                </Button>
            </Box>

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
                        <Box position='relative'>
                            {publicationInteractions?.interactions?.map((int) => (
                                <Preload
                                    key={int.id}
                                    height={`${int.percentageBottom - int.percentageTop}%`}
                                    left={`${int.percentageLeft}%`}
                                    on={() => {
                                        usePrefetchQueryDecorator(
                                            () => getPublicationInteractionUseCase.handle(int.id),
                                            [GetPublicationInteractionUseCase, int.id],
                                        );
                                    }}
                                    onClick={(event) => handleEffectAreaClick(int.id, event)}
                                    onMouseEnter={(event) => handleEffectAreaClick(int.id, event)}
                                    position='absolute'
                                    sx={{
                                        cursor: 'pointer',
                                        background: 'rgb(217,217,217, 0.4)',
                                        border: '1px solid #D9D9D9',

                                        '&:hover': {
                                            background: themePalette.highlight.main,
                                        },
                                    }}
                                    top={`${int.percentageTop}%`}
                                    width={`${int.percentageRight - int.percentageLeft}%`}
                                />
                            ))}

                            {publicationPage?.imageData ? (
                                <Box
                                    alt='publication page image'
                                    component='img'
                                    maxHeight={MAX_IMAGE_HEIGHT}
                                    maxWidth={MAX_IMAGE_WIDTH}
                                    src={publicationPage?.imageData || String()}
                                />
                            ) : (
                                <Skeleton height={MAX_IMAGE_HEIGHT} variant='rectangular' width={430} />
                            )}
                        </Box>
                    )}
                </TransformComponent>
            </TransformWrapper>

            <Popper
                anchorEl={anchorEl}
                disablePortal
                open={Boolean(anchorEl)}
                placement='top'
                style={{ zIndex: 2000 }}
            >
                <ClickAwayListener onClickAway={closePopover}>
                    <Paper>
                        <Column gap={0} py={1}>
                            <Preload
                                on={() => {
                                    if (currentInteraction) {
                                        usePrefetchQueryDecorator(
                                            () => getPublicationInteractionUseCase.handle(currentInteraction),
                                            [currentInteraction],
                                        );
                                    }
                                }}
                            >
                                <ButtonPaperItem
                                    label='Edit'
                                    onClick={() => openEditPublicationInteractionDialog(currentInteraction)}
                                />

                                <ButtonPaperItem
                                    label='Delete'
                                    onClick={() => openDeletePublicationInteractionDialog(currentInteraction)}
                                />
                            </Preload>
                        </Column>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Box>
    );
}
