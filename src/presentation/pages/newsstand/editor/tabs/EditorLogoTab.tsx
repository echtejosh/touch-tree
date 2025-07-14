import React, { ReactElement, useEffect } from 'react';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import Column from 'presentation/components/layout/Column';
import { EditorLogoModel } from 'domain/models/newsstand/NewsstandModel';
import { Box, Row } from 'presentation/components/layout';
import { InputAdornment, Typography } from '@mui/material';
import BackButton from 'presentation/components/navigation/BackButton';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import GetEditorLogoUseCase from 'application/usecases/newsstand/editor/GetEditorLogoUseCase';
import UpdateEditorLogoUseCase from 'application/usecases/newsstand/editor/UpdateEditorLogoUseCase';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import ImagePreviewEditor from 'presentation/components/editor/ImagePreviewEditor';
import { SubmitButton } from 'presentation/components';
import { FormattedMessage } from 'react-intl';
import { useWatch } from 'react-hook-form-mui';

export default function EditorLogoTab(): ReactElement {
    const getEditorLogoUseCase = Container.resolve(GetEditorLogoUseCase);
    const updateEditorLogoUseCase = Container.resolve(UpdateEditorLogoUseCase);

    const { data } = useQuery(getEditorLogoUseCase.handle, [GetEditorLogoUseCase.name]);
    const {
        reset,
        setValues,
        handleSubmit,
        control,
    } = useForm<EditorLogoModel>({ defaultValues: { ...data } });

    const logo = useWatch({ control, name: 'logoFile' });

    async function onSubmit(values: EditorLogoModel): Promise<boolean> {
        const result = await updateEditorLogoUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetEditorLogoUseCase.name]);
            useInvalidateQuery([GetMetricsUseCase.name]);
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
            <Box pb={4}>
                <Typography
                    pb={2}
                    variant='h2'
                >
                    Logo
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
                <FileSelect
                    accepts={['.jpg', '.png', '.jpeg']}
                    control={control}
                    description='.jpg .jpeg or .png'
                    label='Logo'
                    name='logoFile'
                    onChange={(file): void => setValues({ logoFile: file || null, logoShrinkage: 100 })}
                    placeholder='Choose an image (max. 5 MB)'
                />

                <Box display='flex' height={300} width='100%'>
                    <ImagePreviewEditor
                        image={logo?.content || null}
                        imageScale={0.4}
                    />
                </Box>

                <FormTextField
                    control={control}
                    description='Makes the logo smaller'
                    label='Shrink size'
                    name='logoShrinkage'
                    onBlur={({ target }) => setValues({ logoShrinkage: Number(target.value) })}
                    required
                    rules={{
                        min: { value: 10, message: 'The minimum value is 10' },
                        max: { value: 100, message: 'The maximum value is 100' },
                    }}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>,
                        },
                    }}
                    type='number'
                />
                <FormTextField
                    control={control}
                    label='Logo link URL'
                    name='logoLinkUrl'
                    onBlur={({ target }) => setValues({ logoLinkUrl: target.value })}
                    required={false}
                />
            </Column>
        </Box>
    );
}
