import React from 'react';
import { Typography } from '@mui/material';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import { SubmitButton } from 'presentation/components';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import Container from 'infrastructure/services/Container';
import UpdateSupplementCategoryUseCase from 'application/usecases/supplements/UpdateSupplementCategoryUseCase';
import { SupplementCategory } from 'domain/contracts/services/SupplementServiceContract';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import { DialogOptions } from 'presentation/providers/DialogProvider';

interface UpdateSupplementCategoryModalProps extends DialogOptions {
    category: SupplementCategory;
}

export default function UpdateSupplementCategoryModal({
    category,
    onClose,
}: UpdateSupplementCategoryModalProps) {
    const updateSupplementCategoryUseCase = Container.resolve(UpdateSupplementCategoryUseCase);

    const {
        control,
        handleSubmit,
    } = useForm<SupplementCategory>({
        defaultValues: {
            ...category,
        },
    });

    async function onUpdate(values: SupplementCategory) {
        const results = await updateSupplementCategoryUseCase.handle({
            ...values,
            id: category.id,
        });

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
                {category?.label}
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
                        onSubmit={onUpdate}
                    >
                        Save changes
                    </SubmitButton>
                </Row>
            </Column>
        </Box>
    );
}
