import React, { ReactElement, useEffect, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Typography, Snackbar, Alert } from '@mui/material';
import { SubmitButton } from 'presentation/components';
import { useWatch } from 'react-hook-form-mui';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { DevTool } from '@hookform/devtools';
import UpdateRelationIpAddressUseCase from 'application/usecases/newsstand/relation/ipAddress/UpdateRelationIpAddressUseCase';
import { RelationIpAddressModel } from 'domain/models/RelationIpAddressModel';
import GetRelationIpAddressesUseCase from 'application/usecases/newsstand/relation/ipAddress/GetRelationIpAddressesUseCase';
import GetRelationIpAddressUseCase from 'application/usecases/newsstand/relation/ipAddress/GetRelationIpAddressUseCase';

interface UpdateRelationIpAddressModalProps extends DialogOptions {
    id: number;
}

export default function UpdateRelationIpAddressModal({
    id,
    onClose,
}: UpdateRelationIpAddressModalProps): ReactElement {
    const updateRelationIpAddressUseCase = Container.resolve(UpdateRelationIpAddressUseCase);
    const getRelationIpAddressUseCase = Container.resolve(GetRelationIpAddressUseCase);

    const { data: ipAddress } = useQuery(() => getRelationIpAddressUseCase.handle(id), [GetRelationIpAddressUseCase.name, id]);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<RelationIpAddressModel>({
        defaultValues: {
            ...ipAddress,
        },
    });

    // const [rangeLimit, setRangeLimit] = useState(0);
    const [, setUpdatedAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { range = 0, ip = null } = useWatch({ control });

    async function onSubmit(values: RelationIpAddressModel): Promise<boolean> {
        const result = await updateRelationIpAddressUseCase.handle(values);

        if (result && !result.success) {
            setError(result.serverStatus || 'An error occurred');
            return false;
        }

        useInvalidateQuery([GetRelationIpAddressesUseCase.name]);

        onClose();

        return result.success;
    }

    useEffect(() => {
        setUpdatedAddress(ip?.substring(range === 0 ? ip.length : range, 0) || null);
    }, [ip, range]);

    useEffect(() => {
        if (ipAddress) {
            reset(ipAddress);
            // setRangeLimit(ipAddress.ip.length || 0);
        }
    }, [ipAddress]);

    return (
        <Box>
            {/* Error Snackbar */}
            {error && (
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    open={Boolean(error)}
                >
                    <Alert onClose={() => setError(null)} severity='error'>
                        {error}
                    </Alert>
                </Snackbar>
            )}
            <DevTool control={control} />
            <Typography p={4} variant='h2'>
                {`Edit ${ipAddress?.label}`}
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
                        label='IP address'
                        name='ip'
                        // onChange={(event) => {
                        //     setRangeLimit(event.target.value.length || 0);
                        // }}
                        placeholder='255.255.255.255'
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Row>

                {/* cloaked for better ux */}

                {/* <Row justifyContent='space-between'> */}
                {/*     <Box>Range</Box> */}
                {/*     <Box>{updatedAddress}</Box> */}
                {/* </Row> */}

                {/* <Row sx={{ mx: 1 }}> */}
                {/*     <SliderElement */}
                {/*         key={_id} */}
                {/*         control={control} */}
                {/*         marks={[ */}
                {/*             { */}
                {/*                 value: rangeLimit, */}
                {/*                 label: rangeLimit, */}
                {/*             }, */}
                {/*             { */}
                {/*                 value: range, */}
                {/*                 label: range, */}
                {/*             }, */}
                {/*             { */}
                {/*                 value: 0, */}
                {/*                 label: 0, */}
                {/*             }, */}
                {/*         ]} */}
                {/*         max={rangeLimit} */}
                {/*         min={0} */}
                {/*         name='range' */}
                {/*         size='small' */}
                {/*         track='inverted' */}
                {/*         valueLabelDisplay='off' */}
                {/*     /> */}
                {/* </Row> */}
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
