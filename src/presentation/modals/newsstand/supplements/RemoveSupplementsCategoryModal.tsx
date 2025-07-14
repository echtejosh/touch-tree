import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import { CategoryModel } from 'domain/models/newsstand/NewsstandSupplementModel';
import RemoveSupplementCategoryUseCase from 'application/usecases/supplements/RemoveSupplementCategoryUseCase';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';

interface RemoveSupplementCategoryProps extends DialogOptions {
    category: CategoryModel;
}

export default function RemoveSupplementsCategoryModal({
    category,
    onClose,
}: RemoveSupplementCategoryProps) {
    const removeSupplementCategory = Container.resolve(RemoveSupplementCategoryUseCase);

    const {
        handleSubmit,
    } = useForm();

    async function onSubmit() {
        const result = await removeSupplementCategory.handle(category.id);

        if (result) {
            useInvalidateQuery([GetSupplementsUseCase.name]);
            onClose();
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
                {`Delete ${category.label} category?`}
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to delete this category?
                </Typography>
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
                    Delete
                </SubmitButton>
            </Row>
        </Box>
    );
}
