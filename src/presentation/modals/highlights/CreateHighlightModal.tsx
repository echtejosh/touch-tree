import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Alert, Typography } from '@mui/material';
import { SubmitButton } from 'presentation/components';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { HighlightModel } from 'domain/models/HighlightModel';
import FormLabel from 'presentation/components/form/FormLabel';
import PublicationArticleSelect, {
    PublicationArticleSelectRefMethods,
} from 'presentation/components/form/fields/PublicationArticleSelect';
import { CheckboxElement, useWatch } from 'react-hook-form-mui';
import DatePickerElement from 'presentation/components/form/DatePickerElement';
import GetHighlightsUseCase from 'application/usecases/highlights/GetHighlightsUseCase';
import ImagePreviewEditor from 'presentation/components/editor/ImagePreviewEditor';
import GetPublicationPageUseCase from 'application/usecases/publications/GetPublicationPageUseCase';
import CreateHighlightUseCase from 'application/usecases/highlights/CreateHighlightUseCase';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import { NewsstandPublicationPageModel } from 'domain/models/newsstand/NewsstandPublicationModel';

export interface CreateHighlightModalProps extends DialogOptions {}

export default function CreateHighlightModal({
    onClose,
}: CreateHighlightModalProps): ReactElement {
    const getPublicationPageUseCase = Container.resolve(GetPublicationPageUseCase);
    const createHighlightUseCase = Container.resolve(CreateHighlightUseCase);

    const [hasCropped, setHasCropped] = useState(true);

    const publicationRef = useRef<PublicationArticleSelectRefMethods | null>(null);

    const {
        control,
        handleSubmit,
        setValues,
    } = useForm<HighlightModel>({
        defaultValues: {
            endDate: null,
            image: null,
            customImage: null,
            isLocked: false,
            linkedArticleId: null,
            linkedPage: null,
            startDate: null,
            subtitle: null,
            tagline: null,
            title: null,
        },
    });

    const formData = useWatch({ control });

    async function fetchPublicationPageImage(): Promise<NewsstandPublicationPageModel | null> {
        return getPublicationPageUseCase.handle({
            linkedArticleId: formData?.linkedArticleId,
            linkedPage: formData?.linkedPage,
        });
    }

    const { data: publicationPage, isLoading: isPageImageLoading } = useQuery(
        fetchPublicationPageImage,
        [GetPublicationPageUseCase.name, formData?.linkedArticleId, formData?.linkedPage],
    );

    const getImageSource = useMemo(() => {
        if (formData.customImage) {
            return formData.customImage.content;
        }

        return publicationPage?.imageData;
    }, [
        formData?.linkedArticleId,
        formData?.linkedPage,
        formData.customImage,
        publicationPage,
    ]);

    function handleCropStatusChange(cropped: boolean) {
        setHasCropped(cropped);
    }

    function setFormImage(img: string): void {
        setValues({
            image: {
                name: 'edit-highlight',
                content: img,
            },
        });
    }

    async function onSubmit(values: HighlightModel): Promise<boolean> {
        if (!await publicationRef.current?.submit()) return false;

        const result = await createHighlightUseCase.handle(values);

        if (result) {
            onClose();
            useInvalidateQuery([GetHighlightsUseCase.name]);
        }

        return result;
    }

    useEffect((): void => {
        if (getImageSource) {
            setFormImage(getImageSource);
        }
    }, [getImageSource]);

    return (
        <Box>
            <Column columns={2} gap={0}>
                <ImagePreviewEditor
                    image={getImageSource || null}
                    isEditable
                    onCropStatusChange={handleCropStatusChange}
                    onSave={setFormImage}
                />

                <Box p={4}>
                    <Typography ml='auto' pb={4} variant='h2'>
                        Create a new highlight
                    </Typography>

                    <Column>
                        <Column>
                            <FormLabel
                                defaultMessage='Description'
                                id='highlight.form.description'
                            />
                            <Column>
                                <Row>
                                    <FormTextField
                                        control={control}
                                        label='Title'
                                        name='title'
                                    />
                                    <FormTextField
                                        control={control}
                                        label='Subtitle'
                                        name='subtitle'
                                    />
                                </Row>
                                <FormTextField
                                    control={control}
                                    label='General text'
                                    name='tagline'
                                />
                            </Column>
                        </Column>

                        <Column>
                            <FormLabel
                                defaultMessage='Duration'
                                id='highlight.form.duration'
                            />

                            <Column>
                                <Row>
                                    <DatePickerElement
                                        control={control}
                                        label='Start date'
                                        name='startDate'
                                        required
                                    />
                                    <DatePickerElement
                                        control={control}
                                        label='End date'
                                        name='endDate'
                                        required
                                    />
                                </Row>
                            </Column>
                        </Column>

                        <Column>
                            <FormLabel
                                defaultMessage='Image selection'
                                id='highlight.form.image'
                            />

                            {(!getImageSource && !isPageImageLoading) && (
                                <Alert
                                    severity='warning'
                                    sx={{ border: 'none' }}
                                >
                                    No image selected. Please select a publication or upload an image first to see the preview
                                </Alert>
                            )}

                            <PublicationArticleSelect
                                ref={publicationRef}
                                initialArticleId={formData.linkedArticleId}
                                initialPage={formData.linkedPage}
                                onChange={({
                                    articleId,
                                    page,
                                }) => {
                                    setValues({
                                        linkedArticleId: articleId,
                                        linkedPage: page,
                                        customImage: null,
                                    });
                                }}
                            />
                        </Column>

                        <Column>
                            <FileSelect
                                accepts={['.jpg', '.png', '.jpeg']}
                                control={control}
                                description='.jpg .jpeg or .png'
                                label='Select your custom image'
                                name='customImage'
                                onChange={(file) => setValues({ customImage: file })}
                                placeholder='Choose an image (max. 5 MB)'
                                required={false}
                                requireJpegConversion
                            />
                        </Column>

                        <Column>
                            <CheckboxElement
                                control={control}
                                label='Lock this highlight'
                                name='isLocked'
                            />
                        </Column>

                        {(!hasCropped && getImageSource) && (
                            <Alert
                                severity='warning'
                                sx={{
                                    border: 'none',
                                }}
                            >
                                Crop an image first before saving changes
                            </Alert>
                        )}

                        <Row end gap={2}>
                            <SubmitButton
                                disabled={!hasCropped}
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                            >
                                Create highlight
                            </SubmitButton>
                        </Row>
                    </Column>
                </Box>
            </Column>
        </Box>
    );
}
