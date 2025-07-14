import React from 'react';
import { Typography } from '@mui/material';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import { SubmitButton } from 'presentation/components';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import Container from 'infrastructure/services/Container';
import { SupplementCategory } from 'domain/contracts/services/SupplementServiceContract';
import CreateSupplementCategoryUseCase from 'application/usecases/supplements/CreateSupplementCategoryUseCase';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import { DialogOptions } from 'presentation/providers/DialogProvider';

interface CreateSupplementCategoryModalProps extends DialogOptions {}

export default function CreateSupplementCategoryModal({ onClose }: CreateSupplementCategoryModalProps) {
    const createSupplementCategoryUseCase = Container.resolve(CreateSupplementCategoryUseCase);

    const {
        control,
        handleSubmit,
    } = useForm<SupplementCategory>();

    async function onSubmit(values: SupplementCategory) {
        const results = await createSupplementCategoryUseCase.handle(values.label);

        if (results) {
            useInvalidateQuery([GetSupplementsUseCase.name]);
            onClose();
        }

        return results;
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
                Create a new category
            </Typography>

            <Column sx={{ mt: 0.5 }}>
                <Row sx={{ flexDirection: 'column' }}>
                    <FormTextField
                        control={control}
                        label='Label'
                        name='label'
                    />
                </Row>

                <Row end>
                    <SubmitButton
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                    >
                        Save changes
                    </SubmitButton>
                </Row>
            </Column>
        </Box>
    );
}
