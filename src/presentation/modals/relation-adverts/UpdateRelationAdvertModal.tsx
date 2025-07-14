import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert, InputAdornment, Typography,
} from '@mui/material';
import { Box, Column, Row } from 'presentation/components/layout';
import { FileShape } from 'domain/contracts/services/FileServiceContract';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import PublicationArticleSelect, { PublicationArticleSelectRefMethods } from 'presentation/components/form/fields/PublicationArticleSelect';
import { AdvertType, RelationAdvertLinkType, RelationAdvertModel } from 'domain/models/RelationAdvertModel';
import { useWatch } from 'react-hook-form-mui';
import ImagePreviewEditor from 'presentation/components/editor/ImagePreviewEditor';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import FormLabel from 'presentation/components/form/FormLabel';
import { SelectDecorator } from 'presentation/components/form/fields/SelectDecorator';
import { resetValuesMap } from 'presentation/modals/relation-adverts/CreateRelationAdvertModal';
import url from 'utils/url';
import { SubmitButton } from 'presentation/components';
import { FormattedMessage } from 'react-intl';
import { DatePicker } from '@mui/x-date-pickers';
import GetRelationAdvertUseCase from 'application/usecases/relation-adverts/GetRelationAdvertUseCase';
import UpdateRelationAdvertUseCase from 'application/usecases/relation-adverts/UpdateRelationAdvertUseCase';
import GetRelationAdvertsUseCase from 'application/usecases/relation-adverts/GetRelationAdvertsUseCase';
import GetRelationAdvertTypesUseCase from 'application/usecases/relation-adverts/GetRelationAdvertTypesUseCase';
import str from 'utils/str';

export interface UpdateRelationAdvertModalProps extends DialogOptions {
    id: number;
}

export default function UpdateRelationAdvertModal({ id, onClose }: UpdateRelationAdvertModalProps): ReactElement {
    const getRelationAdvertUseCase = Container.resolve(GetRelationAdvertUseCase);
    const updateRelationAdvertUseCase = Container.resolve(UpdateRelationAdvertUseCase);
    const getRelationAdvertTypesUseCase = Container.resolve(GetRelationAdvertTypesUseCase);

    async function fetchData(): Promise<RelationAdvertModel | null> {
        return getRelationAdvertUseCase.handle(id);
    }

    const { data: relationAdvert } = useQuery(fetchData, [GetRelationAdvertUseCase.name, id]);
    const { data: advertTypes } = useQuery(getRelationAdvertTypesUseCase.handle, [GetRelationAdvertTypesUseCase.name]);

    const [previewImage, setPreviewImage] = useState<FileShape | null>(relationAdvert?.image || null);

    const publicationRef = useRef<PublicationArticleSelectRefMethods | null>(null);

    const {
        control,
        reset,
        handleSubmit,
        getValues,
        setValue,
        setValues,
    } = useForm<RelationAdvertModel>({ defaultValues: { ...relationAdvert } });

    const { linkType, typeId } = useWatch({ control });

    const _advertTypes = useMemo(() => {
        return advertTypes?.map(({ id: _id, label }) => ({
            value: _id,
            name: str.capitalize(label),
        })) || [];
    }, [advertTypes]);

    const isInlineType = typeId === AdvertType.Inline;

    async function onSubmit(values: RelationAdvertModel): Promise<boolean> {
        if (!await publicationRef.current?.submit() && linkType === 'article') return false;

        const result = await updateRelationAdvertUseCase.handle(values);

        if (result) {
            useInvalidateQuery([GetRelationAdvertsUseCase.name]);
            onClose();
        }

        return result;
    }

    useEffect((): void => {
        if (relationAdvert) {
            setPreviewImage(relationAdvert.image);

            reset(relationAdvert);
        }
    }, [relationAdvert]);

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
                        {`Advert id. ${relationAdvert?.id}`}
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
                                id='relationAdvert.form.duration'
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
                                id='relationAdvert.form.link'
                            />

                            <SelectDecorator
                                label='Link as'
                                onChange={(value) => {
                                    setValue('linkType', value as RelationAdvertLinkType);

                                    if (value in resetValuesMap) {
                                        setValues(resetValuesMap[value as RelationAdvertLinkType]);
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
                                    initialArticleId={relationAdvert?.linkedArticleId}
                                    initialPage={relationAdvert?.linkedPage}
                                    onChange={(linkage) => {
                                        setValues({
                                            linkedPage: linkage.page,
                                            linkedArticleId: linkage.articleId,
                                        });
                                    }}
                                />
                            )}
                        </Column>

                        <Column>
                            <FormLabel
                                defaultMessage='Advert type'
                                id='relation-advert.form.advert-type'
                            />

                            <SelectDecorator
                                label=''
                                onChange={(value) => {
                                    setValue('typeId', value);
                                    if (value !== AdvertType.Inline) {
                                        setValue('inlineAdvertIntervalSeconds', null);
                                    }
                                }}
                                options={_advertTypes}
                                value={typeId}
                            />

                            {isInlineType && (
                                <FormTextField
                                    control={control}
                                    defaultValue={20}
                                    fullWidth
                                    helperText='Seconds after login when this ad will first appear'
                                    label='Time delay'
                                    name='inlineAdvertIntervalSeconds'
                                    placeholder='20'
                                    rules={{
                                        required: 'Time delay is required for inline ads',
                                        min: {
                                            value: 1,
                                            message: 'Minimum 1 second',
                                        },
                                        max: {
                                            value: 500,
                                            message: 'Maximum 500 seconds (8.3 minutes)',
                                        },
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Must be a whole number',
                                        },
                                    }}
                                    slotProps={{
                                        htmlInput: { min: 1, max: 500, step: 1 },
                                        input: {
                                            endAdornment: <InputAdornment position='end'>seconds</InputAdornment>,
                                        },
                                    }}
                                    type='number'
                                />
                            )}
                        </Column>

                        <Row end gap={2}>
                            <SubmitButton
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                            >
                                <FormattedMessage id='button.save' />
                            </SubmitButton>
                        </Row>
                    </Column>
                </Box>
            </Column>
        </Box>
    );
}
