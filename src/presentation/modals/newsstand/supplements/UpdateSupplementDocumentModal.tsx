import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { SelectElement } from 'react-hook-form-mui';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import { DevTool } from '@hookform/devtools';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { UpdateDocumentModel } from 'domain/models/newsstand/NewsstandSupplementModel';
import UpdateSupplementDocumentUseCase from 'application/usecases/supplements/UpdateSupplementDocumentUseCase';

interface SupplementEditDocumentModalProps extends DialogOptions {
    document: UpdateDocumentModel;
}

export default function UpdateSupplementDocumentModal({
    document,
    onClose,
}: SupplementEditDocumentModalProps) {
    const updateSupplementDocumentUseCase = Container.resolve(UpdateSupplementDocumentUseCase);
    const getSupplementsUseCase = Container.resolve(GetSupplementsUseCase);

    const { data: supplements } = useQuery(getSupplementsUseCase.handle, [GetSupplementsUseCase.name]);

    const {
        control,
        handleSubmit,
    } = useForm<UpdateDocumentModel>({ defaultValues: document });

    async function onSubmit(values: UpdateDocumentModel): Promise<boolean> {
        const result = await updateSupplementDocumentUseCase.handle(values);

        if (result) {
            onClose();
            useInvalidateQuery([GetSupplementsUseCase.name]);
        }

        return result;
    }

    return (
        <Box m={4}>
            <DevTool control={control} />
            <Typography
                sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    mb: 3,
                }}
            >
                Edit document
            </Typography>

            <Column my={4}>
                <Row
                    sx={{ flexDirection: 'column' }}
                >
                    <FormTextField
                        control={control}
                        label='Document name'
                        name='label'
                    />
                    <SelectElement
                        control={control}
                        label='Select category'
                        name='categoryId'
                        options={supplements?.categories || []}
                        required
                    />
                </Row>
            </Column>

            <Row justifyContent='space-between'>
                <Button
                    color='primary'
                    onClick={onClose}
                    size='large'
                    variant='outlined'
                >
                    Cancel
                </Button>

                <SubmitButton
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    size='large'
                    variant='contained'
                >
                    Update
                </SubmitButton>
            </Row>
        </Box>
    );
}
