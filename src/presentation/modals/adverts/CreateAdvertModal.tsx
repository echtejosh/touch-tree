import React, { ReactElement, useRef, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery } from 'presentation/hooks';
import { AdvertLinkType, AdvertModel } from 'domain/models/AdvertModel';
import { Alert, Typography } from '@mui/material';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import { DatePicker } from '@mui/x-date-pickers';
import { SubmitButton } from 'presentation/components';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import GetAdvertsUseCase from 'application/usecases/adverts/GetAdvertsUseCase';
import CreateAdvertUseCase from 'application/usecases/adverts/CreateAdvertUseCase';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SelectDecorator } from 'presentation/components/form/fields/SelectDecorator';
import PublicationArticleSelect, {
    PublicationArticleSelectRefMethods,
} from 'presentation/components/form/fields/PublicationArticleSelect';
import ImagePreviewEditor from 'presentation/components/editor/ImagePreviewEditor';
import FormLabel from 'presentation/components/form/FormLabel';
import { useWatch } from 'react-hook-form-mui';
import url from 'utils/url';

export const resetValuesMap: Record<AdvertLinkType, Partial<AdvertModel>> = {
    none: {
        linkedPage: null,
        linkedArticleId: null,
        url: null,
    },
    url: {
        linkedPage: null,
        linkedArticleId: null,
    },
    article: {
        url: null,
    },
};

export default function CreateAdvertModal({ onClose }: DialogOptions): ReactElement {
    const createAdvertUseCase = Container.resolve(CreateAdvertUseCase);

    const [previewImage, setPreviewImage] = useState<FileShape | null>(null);

    const publicationRef = useRef<PublicationArticleSelectRefMethods | null>(null);

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        setValues,
    } = useForm<AdvertModel>();

    const { linkType = 'none' } = useWatch({ control });

    async function onSubmit(values: AdvertModel): Promise<boolean> {
        if (!await publicationRef.current?.submit() && linkType === 'article') return false;

        const result = await createAdvertUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetAdvertsUseCase.name]);
            onClose();
        }

        return result;
    }

    return (
        <Box>
            <Column columns={2} gap={0}>
                <ImagePreviewEditor
                    image={previewImage?.content || null}
                    imageScale={0.75}
                />

                <Box p={4}>
                    <Typography
                        pb={4}
                        sx={{
                            width: 'calc(100% - 80px)',
                        }}
                        variant='h2'
                    >
                        Create a new advert
                    </Typography>

                    <Column>
                        {!previewImage && (
                            <Alert
                                severity='warning'
                                sx={{ border: 'none' }}
                            >
                                No image selected. Please select an image first to see the preview
                            </Alert>
                        )}

                        <Row fill>
                            <FormTextField
                                control={control}
                                fullWidth
                                label='Name'
                                name='name'
                            />

                            <FileSelect
                                accepts={['.jpg', '.png', '.jpeg']}
                                control={control}
                                description='.jpg .jpeg or .png'
                                label='Image'
                                name='image'
                                onChange={setPreviewImage}
                                placeholder='Choose a file (max. 5 MB)'
                                requireJpegConversion
                            />
                        </Row>

                        <Column>
                            <FormLabel
                                defaultMessage='Duration'
                                id='advert.form.duration'
                            />

                            <Row fill>
                                <DatePicker
                                    format='MMMM d yyyy'
                                    label='Start date'
                                    onChange={(value): void => setValue('startDate', value)}
                                    value={getValues().startDate}
                                />

                                <DatePicker
                                    format='MMMM d yyyy'
                                    label='End date'
                                    onChange={(value): void => setValue('endDate', value)}
                                    value={getValues().endDate}
                                />
                            </Row>
                        </Column>

                        <Column>
                            <FormLabel
                                defaultMessage='Link'
                                id='advert.form.link'
                            />

                            <SelectDecorator
                                label='Link as'
                                onChange={(value) => {
                                    setValue('linkType', value as AdvertLinkType);

                                    if (value in resetValuesMap) {
                                        setValues(resetValuesMap[value as AdvertLinkType]);
                                    }
                                }}
                                options={[
                                    {
                                        value: 'none',
                                        name: 'None',
                                    },
                                    {
                                        value: 'url',
                                        name: 'URL',
                                    },
                                    {
                                        value: 'article',
                                        name: 'Publication',
                                    },
                                ]}
                                value={linkType}
                            />

                            {linkType === 'url' && (
                                <FormTextField
                                    control={control}
                                    fullWidth
                                    label='Please provide a URL'
                                    name='url'
                                    placeholder='https://'
                                    rules={{
                                        validate: (value) => {
                                            return url.isValid(value as string) ? true : 'Invalid URL format';
                                        },
                                    }}
                                    type='url'
                                />
                            )}

                            {linkType === 'article' && (
                                <PublicationArticleSelect
                                    ref={publicationRef}
                                    onChange={(linkage) => {
                                        setValues({
                                            linkedPage: linkage.page,
                                            linkedArticleId: linkage.articleId,
                                        });
                                    }}
                                />
                            )}
                        </Column>

                        <Row end gap={2}>
                            <SubmitButton
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                            >
                                Create advert
                            </SubmitButton>
                        </Row>
                    </Column>
                </Box>
            </Column>
        </Box>
    );
}
