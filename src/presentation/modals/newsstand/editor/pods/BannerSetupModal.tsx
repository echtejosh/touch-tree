import React, { useRef } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import Container from 'infrastructure/services/Container';
import { useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import { SelectElement, useWatch } from 'react-hook-form-mui';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import PublicationArticleSelect, {
    PublicationArticleSelectRefMethods,
} from 'presentation/components/form/fields/PublicationArticleSelect';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import { DevTool } from '@hookform/devtools';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import ImagePreviewEditor from 'presentation/components/editor/ImagePreviewEditor';
import url from 'utils/url';
import useFormDecorator from 'presentation/hooks/decorators/useFormDecorator';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';

export type EditorPodForm = ReturnType<typeof useFormDecorator<EditorPodModel>>;

export interface BannerSetupModalProps extends DialogOptions {
    form: EditorPodForm;
    itemNum: number;
}

export default function BannerSetupModal({
    form,
    itemNum,
    onClose,
}: BannerSetupModalProps) {
    const getSupplementsUseCase = Container.resolve(GetSupplementsUseCase);

    const { data: supplements } = useQuery(getSupplementsUseCase.handle, [GetSupplementsUseCase.name]);

    const publicationRef = useRef<PublicationArticleSelectRefMethods | null>(null);

    const { control, setValues, handleSubmit, reset } = form;

    const { imgSrc, linkage } = useWatch({ control });

    function handleClearForm(): void {
        reset({
            imgSrc: null,
            linkage: {
                type: 'none',
                url: null,
                articleId: null,
                page: null,
                documentId: null,
            },
        });
    }

    async function handleFormSubmit() {
        if (linkage?.type === 'article' && !await publicationRef.current?.submit()) return;

        handleSubmit(onClose)();
    }

    return (
        <Column columns={2} gap={0}>
            <ImagePreviewEditor
                image={imgSrc?.content || null}
                imageScale={0.4}
            />

            <Box p={4}>
                <DevTool control={control} />
                <Typography
                    sx={{
                        fontSize: 24,
                        fontWeight: 600,
                        mb: 3,
                    }}
                >
                    {`Banner ${itemNum}`}
                </Typography>

                <Column my={4}>
                    <FileSelect
                        accepts={['.jpg', '.png', '.jpeg']}
                        control={control}
                        description='.jpg .jpeg or .png'
                        label='Banner image'
                        name='imgSrc'
                        placeholder='Choose an image (max. 5 MB)'
                        requireJpegConversion
                    />

                    <SelectElement
                        control={control}
                        label='Link type'
                        name='linkage.type'
                        onChange={(value) => {
                            setValues({
                                'linkage.type': value,
                                'linkage.url': null,
                                'linkage.documentId': null,
                                'linkage.articleId': null,
                                'linkage.page': null,
                            });
                        }}
                        options={[
                            {
                                id: 'none',
                                label: 'None',
                            },
                            {
                                id: 'url',
                                label: 'URL',
                            },
                            {
                                id: 'article',
                                label: 'Publication',
                            },
                            {
                                id: 'document',
                                label: 'Supplement',
                            },
                        ]}
                    />

                    {linkage?.type === 'url' && (
                        <FormTextField
                            control={control}
                            label='Enter the web link'
                            name='linkage.url'
                            placeholder='https://'
                            rules={{
                                validate: (value) => {
                                    return url.isValid(value as string) ? true : 'Invalid URL format';
                                },
                            }}
                            type='url'
                        />
                    )}

                    {linkage?.type === 'article' && (
                        <PublicationArticleSelect
                            ref={publicationRef}
                            initialArticleId={linkage?.articleId}
                            initialPage={linkage?.page}
                            onChange={({
                                articleId,
                                page,
                            }) => {
                                setValues({
                                    'linkage.articleId': articleId,
                                    'linkage.page': page,
                                });
                            }}
                        />
                    )}

                    {linkage?.type === 'document' && (
                        <SelectElement
                            control={control}
                            label='Select a document'
                            name='linkage.documentId'
                            onChange={() => {
                                setValues({
                                    'linkage.page': 1,
                                });
                            }}
                            options={supplements?.documents?.map((doc) => {
                                return {
                                    id: doc.id,
                                    label: doc.name,
                                };
                            })}
                            required
                        />
                    )}
                </Column>

                <Row justifyContent='space-between'>
                    <Button
                        onClick={handleClearForm}
                        size='large'
                        variant='outlined'
                    >
                        Reset
                    </Button>

                    <Row>
                        <Button
                            disabled={!imgSrc}
                            onClick={handleFormSubmit}
                            size='large'
                            type='submit'
                            variant='contained'
                        >
                            Save
                        </Button>
                    </Row>
                </Row>
            </Box>
        </Column>
    );
}
