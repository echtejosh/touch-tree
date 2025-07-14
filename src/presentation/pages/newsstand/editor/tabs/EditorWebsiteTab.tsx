import React, { ReactElement, useEffect } from 'react';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import Column from 'presentation/components/layout/Column';
import { EditorWebsiteModel } from 'domain/models/newsstand/NewsstandModel';
import { Box, Row } from 'presentation/components/layout';
import { Typography } from '@mui/material';
import BackButton from 'presentation/components/navigation/BackButton';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import UpdateEditorFaviconUseCase from 'application/usecases/newsstand/editor/UpdateEditorFaviconUseCase';
import GetEditorFaviconUseCase from 'application/usecases/newsstand/editor/GetEditorFaviconUseCase';
import ImagePreviewEditor from 'presentation/components/editor/ImagePreviewEditor';
import { SubmitButton } from 'presentation/components';
import { FormattedMessage } from 'react-intl';
import { useWatch } from 'react-hook-form-mui';

export default function EditorWebsiteTab(): ReactElement {
    const getEditorFaviconUseCase = Container.resolve(GetEditorFaviconUseCase);
    const updateEditorFaviconUseCase = Container.resolve(UpdateEditorFaviconUseCase);

    const { data } = useQuery(getEditorFaviconUseCase.handle, [GetEditorFaviconUseCase.name]);
    const {
        reset,
        setValues,
        handleSubmit,
        control,
    } = useForm<EditorWebsiteModel>({ defaultValues: { ...data } });

    const favicon = useWatch({ control, name: 'favicon' });

    async function onSubmit(values: EditorWebsiteModel): Promise<boolean> {
        const result = await updateEditorFaviconUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetEditorFaviconUseCase.name]);
        }

        return result;
    }

    useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data]);

    return (
        <Box p={4} width={560}>
            <Box mb={4}>
                <Typography
                    mb={2}
                    variant='h2'
                >
                    Browser
                </Typography>

                <Row
                    gap={0}
                    sx={{
                        position: 'relative',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <BackButton label='Categories' to='/newsstand/editor' />

                    <SubmitButton
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        size='large'
                    >
                        <FormattedMessage
                            defaultMessage='Save changes'
                            id='button.save'
                        />
                    </SubmitButton>
                </Row>
            </Box>

            <Column gap={4}>
                <FormTextField
                    control={control}
                    label='Browser tab title'
                    name='title'
                    onBlur={({ target }) => setValues({ title: target.value })}
                />
                <FileSelect
                    accepts={['.jpg', '.jpeg', '.png']}
                    control={control}
                    description='.jpg .jpeg or .png'
                    label='Browser favicon'
                    name='favicon'
                    onChange={(file): void => setValues({ favicon: file })}
                    placeholder='Choose an image (max. 5 MB)'
                />

                <Box display='flex' height={300} width='100%'>
                    <ImagePreviewEditor
                        image={favicon?.content || null}
                        imageScale={0.45}
                    />
                </Box>
            </Column>
        </Box>
    );
}
