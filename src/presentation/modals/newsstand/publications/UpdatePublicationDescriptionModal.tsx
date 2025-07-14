import React from 'react';
import { Typography } from '@mui/material';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import UpdatePublicationDescriptionUseCase from 'application/usecases/publications/UpdatePublicationDescriptionUseCase';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import { SubmitButton } from 'presentation/components';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { PublicationDescriptionModel } from 'domain/models/newsstand/NewsstandPublicationModel';
import GetPublicationsUseCase from 'application/usecases/publications/GetPublicationsUseCase';

interface UpdatePublicationDescriptionModalProps {
    publication: PublicationDescriptionModel;
}

export default function UpdatePublicationDescriptionModal({
    publication,
}: UpdatePublicationDescriptionModalProps) {
    const updatePublicationDescriptionUseCase = Container.resolve(UpdatePublicationDescriptionUseCase);

    const {
        control,
        handleSubmit,
    } = useForm<PublicationDescriptionModel>({ defaultValues: publication });

    async function onUpdate(formData: PublicationDescriptionModel) {
        const result = await updatePublicationDescriptionUseCase.handle(formData);

        if (result) {
            useInvalidateQuery([GetPublicationsUseCase.name]);
        }

        return result;
    }

    return (
        <Box m={4}>
            <Typography
                sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    mb: 3,
                }}
            >
                {publication.name}
            </Typography>

            <Column sx={{ mt: 0.5 }}>
                <Row sx={{ flexDirection: 'column' }}>
                    <FormTextField
                        control={control}
                        label='Description'
                        multiline
                        name='description'
                        rows={10}
                    />
                </Row>

                <Row end>
                    <SubmitButton
                        handleSubmit={handleSubmit}
                        onSubmit={onUpdate}
                    >
                        Save changes
                    </SubmitButton>
                </Row>
            </Column>
        </Box>
    );
}
