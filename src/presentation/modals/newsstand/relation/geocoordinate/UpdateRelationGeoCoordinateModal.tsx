import React, { ReactElement, useEffect } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Typography } from '@mui/material';
import { SubmitButton } from 'presentation/components';
import { useWatch } from 'react-hook-form-mui';
import { CampaignGeoCoordinateModel } from 'domain/models/CampaignGeoCoordinateModel';
import { DevTool } from '@hookform/devtools';
import { MapContainer, TileLayer, Circle, useMapEvents, useMap } from 'react-leaflet';
import { MarkerLayer, Marker } from 'react-leaflet-marker';
import 'leaflet/dist/leaflet.css';
import { themePalette } from 'presentation/theme';
import { LocationIcon } from 'presentation/components/icons';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { LatLngTuple } from 'leaflet';
import GetRelationGeoCoordinateUseCase from 'application/usecases/newsstand/relation/coordinates/GetRelationGeoCoordinateUseCase';
import UpdateRelationGeoCoordinateUseCase from 'application/usecases/newsstand/relation/coordinates/UpdateRelationGeoCoordinateUseCase';
import GetRelationGeoCoordinatesUseCase from 'application/usecases/newsstand/relation/coordinates/GetRelationGeoCoordinatesUseCase';

// const LondonLocation = {
//     Coordinate: { lat: 51.507351, lng: -0.127758 },
//     Zoom: 12,
// } as const;

interface CreateCampaignGeoCoordinateModalProps extends DialogOptions {
    id: number;
}

interface MapClickHandlerProps {
    latitude: number;
    longitude: number;
}

export default function UpdateRelationGeoCoordinateModal({
    id,
    onClose,
}: CreateCampaignGeoCoordinateModalProps): ReactElement {
    const getRelationGeoCoordinateUseCase = Container.resolve(GetRelationGeoCoordinateUseCase);
    const updateRelationGeoCoordinateUseCase = Container.resolve(UpdateRelationGeoCoordinateUseCase);

    const { data: relationCoordinate } = useQuery(
        () => getRelationGeoCoordinateUseCase.handle(id),
        [GetRelationGeoCoordinateUseCase.name, id],
    );

    const {
        control,
        handleSubmit,
        setValues,
        reset,
    } = useForm<CampaignGeoCoordinateModel>({ defaultValues: { ...relationCoordinate } });
    console.log(relationCoordinate);

    const {
        radius = 0,
        latitude = 0,
        longitude = 0,
    } = useWatch({ control });

    function MapClickHandler({
        latitude: lat,
        longitude: lng,
    }: MapClickHandlerProps): null {
        const map = useMap();

        useEffect(() => {
            if (lat !== 0 && lng !== 0) {
                map.setView([lat, lng], map.getZoom(), { animate: true });
            }
        }, [lat, lng, map]);

        useMapEvents({
            click: ({ latlng }) => {
                setValues({
                    latitude: latlng.lat,
                    longitude: latlng.lng,
                });
            },
        });

        return null;
    }

    async function onSubmit(values: CampaignGeoCoordinateModel): Promise<boolean> {
        const result = await updateRelationGeoCoordinateUseCase.handle(values);

        console.log(result);

        if (result) {
            useInvalidateQuery([GetRelationGeoCoordinateUseCase.name, id]);
            useInvalidateQuery([GetRelationGeoCoordinatesUseCase.name]);
            onClose();
        }

        return result;
    }

    useEffect(() => {
        if (relationCoordinate) {
            reset(relationCoordinate);
        }
    }, [relationCoordinate]);

    return (
        <Box>
            <DevTool control={control} />

            <Typography p={4} variant='h2'>
                {`Edit ${relationCoordinate?.label} geo coordinate`}
            </Typography>

            <Column mt={1} p={4} pt={0}>
                <Row fill>
                    <FormTextField
                        control={control}
                        fullWidth
                        label='Label'
                        name='label'
                    />
                </Row>

                <Row fill>
                    <FormTextField
                        control={control}
                        fullWidth
                        label='Latitude'
                        name='latitude'
                        required
                        type='number'
                    />
                    <FormTextField
                        control={control}
                        fullWidth
                        label='Longitude'
                        name='longitude'
                        required
                        type='number'
                    />
                </Row>

                {/* cloaked for better ux */}

                {/* <Row justifyContent='space-between'> */}
                {/*     <Box>Range</Box> */}
                {/*     <Box>{`${radius} meter(s)`}</Box> */}
                {/* </Row> */}

                {/* <Row sx={{ mx: 1 }}> */}
                {/*     <SliderElement */}
                {/*         control={control} */}
                {/*         marks={[ */}
                {/*             { */}
                {/*                 value: 0, */}
                {/*                 label: 0, */}
                {/*             }, */}
                {/*             { */}
                {/*                 value: radius, */}
                {/*                 label: radius, */}
                {/*             }, */}
                {/*             { */}
                {/*                 value: 500, */}
                {/*                 label: 500, */}
                {/*             }, */}
                {/*         ]} */}
                {/*         max={500} */}
                {/*         min={0} */}
                {/*         name='radius' */}
                {/*         size='small' */}
                {/*         valueLabelDisplay='off' */}
                {/*     /> */}
                {/* </Row> */}

                <Row
                    sx={{
                        '*:focus-visible': {
                            outline: 'none',
                        },
                    }}
                >
                    <MapContainer
                        center={[latitude, longitude] as LatLngTuple}
                        style={{
                            width: '100%',
                            height: '300px',
                            borderRadius: '8px',
                        }}
                        zoom={17}
                    >
                        <TileLayer
                            attribution={(
                                '&copy; <a href="https://www.openstreetmap.org/copyright">'
                                + 'OpenStreetMap</a> contributors'
                            )}
                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        />
                        <MarkerLayer>
                            <MapClickHandler latitude={latitude} longitude={longitude} />
                            <Marker
                                position={[latitude, longitude]}
                                size={[25, 25]}
                            >
                                <LocationIcon
                                    sx={{
                                        color: themePalette.primary.main,
                                    }}
                                />
                            </Marker>
                            <Circle
                                center={[latitude, longitude]}
                                pathOptions={{
                                    fillColor: themePalette.primary.main,
                                    fillOpacity: 0.1,
                                    color: themePalette.primary.main,
                                    opacity: 0.8,
                                }}
                                radius={radius}
                            />
                        </MarkerLayer>
                    </MapContainer>
                </Row>
            </Column>

            <Row end gap={2} m={4} mt={0}>
                <SubmitButton
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                >
                    Save changes
                </SubmitButton>
            </Row>
        </Box>
    );
}
