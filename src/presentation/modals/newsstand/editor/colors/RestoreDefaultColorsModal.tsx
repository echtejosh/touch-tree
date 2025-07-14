import React from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import { useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import GetDefaultEditorColorsUseCase from 'application/usecases/newsstand/editor/GetDefaultEditorColorsUseCase';
import Container from 'infrastructure/services/Container';
import { EditorColorsModel } from 'domain/models/newsstand/NewsstandModel';

interface RestoreDefaultColorsModalProps extends DialogOptions {
    onRestore: (defaultColors: EditorColorsModel) => void;
}

export default function RestoreDefaultColorsModal({
    onRestore,
    onClose,
}: RestoreDefaultColorsModalProps) {
    const getDefaultEditorColorsUseCase = Container.resolve(GetDefaultEditorColorsUseCase);
    const { data: defaultEditorColors } = useQuery(getDefaultEditorColorsUseCase.handle, [GetDefaultEditorColorsUseCase.name]);

    function onSubmit() {
        if (defaultEditorColors) {
            onRestore(defaultEditorColors);
        }
        onClose();
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
                Restore colours?
            </Typography>

            <Column mb={4}>
                <Typography variant='subtitle1'>
                    Are you sure you want to restore the default colours?
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

                <Button
                    onClick={onSubmit}
                    size='large'
                    type='submit'
                    variant='contained'
                >
                    Restore
                </Button>
            </Row>
        </Box>
    );
}
