import React, { useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Alert, Button, Typography } from '@mui/material';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import { SelectElement } from 'react-hook-form-mui';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import { DevTool } from '@hookform/devtools';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import CreateSupplementDocumentUseCase from 'application/usecases/supplements/CreateSupplementDocumentUseCase';
import { CreateDocumentModel } from 'domain/models/newsstand/NewsstandSupplementModel';

export default function CreateSupplementDocumentModal({
    onClose,
}: DialogOptions) {
    const createSupplementDocumentUseCase = Container.resolve(CreateSupplementDocumentUseCase);
    const getSupplementsUseCase = Container.resolve(GetSupplementsUseCase);
    const [showProcessingAlert, setShowProcessingAlert] = useState(false);

    const { data: supplements } = useQuery(getSupplementsUseCase.handle, [GetSupplementsUseCase.name]);

    const {
        control,
        handleSubmit,
    } = useForm<CreateDocumentModel>();

    async function onSubmit(document: CreateDocumentModel): Promise<boolean> {
        setShowProcessingAlert(true);
        const result = await createSupplementDocumentUseCase.handle(document);

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
                Add document
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
                    <FileSelect
                        accepts={['.pdf']}
                        control={control}
                        description='Rquired file format: *.pdf'
                        label='File'
                        name='file'
                        placeholder='Choose a file (max. 30 MB)'
                    />
                </Row>

                {showProcessingAlert && (
                    <Alert severity='info' sx={{ border: 'none' }}>
                        Processing may take up to a minute, depending on the file size.
                    </Alert>
                )}
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
                    Add
                </SubmitButton>
            </Row>
        </Box>
    );
}
