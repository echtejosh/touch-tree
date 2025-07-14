import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { CircularProgress, Typography } from '@mui/material';
import { SubmitButton } from 'presentation/components';
import { useWatch } from 'react-hook-form-mui'; import { DevTool } from '@hookform/devtools';
import { MapContainer, TileLayer, Circle, useMapEvents, useMap } from 'react-leaflet';
import { MarkerLayer, Marker } from 'react-leaflet-marker';
import 'leaflet/dist/leaflet.css';
import { themePalette } from 'presentation/theme';
import { LocationIcon } from 'presentation/components/icons';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import L from 'leaflet';
import CreateRelationGeoCoordinateUseCase from 'application/usecases/newsstand/relation/coordinates/CreateRelationGeoCoordinateUseCase';
import { RelationCoordinateModel } from 'domain/models/RelationCoordinateModel';
import GetRelationGeoCoordinatesUseCase from 'application/usecases/newsstand/relation/coordinates/GetRelationGeoCoordinatesUseCase';

const LondonLocation = {
    Coordinate: { lat: 51.507351, lng: -0.127758 },
    Zoom: 17,
} as const;

function MapInitializer({ setMap }: { setMap: (map: L.Map) => void }) {
    const map = useMap();

    useEffect(() => {
        setMap(map);
    }, [map, setMap]);

    return null;
}

interface CreateCampaignIpAddressModalProps extends DialogOptions {

}

export default function CreateRelationGeoCoordinateModal({
    onClose,
}: CreateCampaignIpAddressModalProps): ReactElement {
    const createRelationGeoCoordinateUseCase = Container.resolve(CreateRelationGeoCoordinateUseCase);

    const mapRef = useRef<L.Map | null>(null);

    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>(LondonLocation.Coordinate);
    const [loading, setLoading] = useState(true);

    const {
        control,
        handleSubmit,
        setValues,
    } = useForm<RelationCoordinateModel>({
        defaultValues: {
            radius: 50,
        },
    });

    const {
        radius = 50,
        latitude: _latitude = 0,
        longitude: _longitude = 0,
    } = useWatch({ control });

    const latitude = _latitude || 0;
    const longitude = _longitude || 0;

    const setMap = (map: L.Map) => {
        if (!mapRef.current) {
            mapRef.current = map;
        }
    };

    function MapClickHandler(): null {
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

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude: lat, longitude: lng } = position.coords;
                    setCurrentLocation({ lat, lng });

                    setValues({
                        latitude: lat,
                        longitude: lng,
                    });
                    setLoading(false);
                },
                (error) => {
                    console.error('Error obtaining location:', error);
                    setValues({
                        latitude: LondonLocation.Coordinate.lat,
                        longitude: LondonLocation.Coordinate.lng,
                    });
                    setLoading(false);
                },
                { maximumAge: 6000 },
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current;
            const bounds = map.getBounds();
            const markerLatLng = L.latLng(latitude, longitude);

            if (!bounds.contains(markerLatLng)) {
                map.setView(markerLatLng, map.getZoom());
            }
        }
    }, [latitude, longitude]);

    async function onSubmit(values: RelationCoordinateModel): Promise<boolean> {
        const result = await createRelationGeoCoordinateUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetRelationGeoCoordinatesUseCase.name]);
            onClose();
        }

        return result;
    }

    return (
        <Box>
            <DevTool control={control} />

            <Typography p={4} variant='h2'>
                Create geo coordinate
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
                    {loading ? (
                        <Row sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '300px',
                        }}
                        >
                            <CircularProgress />
                        </Row>
                    ) : (
                        <MapContainer
                            center={currentLocation}
                            style={{
                                width: '100%',
                                height: '300px',
                                borderRadius: '8px',
                            }}
                            zoom={LondonLocation.Zoom}
                        >
                            <MapInitializer setMap={setMap} />
                            <TileLayer
                                attribution={(
                                    '&copy; <a href="https://www.openstreetmap.org/copyright">'
                                    + 'OpenStreetMap</a> contributors'
                                )}
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            />
                            <MarkerLayer>
                                <MapClickHandler />
                                <Marker
                                    position={{
                                        lat: latitude,
                                        lng: longitude,
                                    }}
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
                    )}
                </Row>
            </Column>

            <Row end gap={2} m={4} mt={0}>
                <SubmitButton
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                >
                    Create
                </SubmitButton>
            </Row>
        </Box>
    );
}
