import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import Container from 'infrastructure/services/Container';
import PublicationInteractionImagePreview, { CropEdges, InteractionTypes } from 'presentation/components/PublicationInteractionImagePreview';
import GetPublicationInteractionsUseCase from 'application/usecases/publications/GetPublicationInteractionsUseCase';
import { CheckboxElement, SelectElement } from 'react-hook-form-mui';
import { PublicationInteraction } from 'domain/models/PublicationInteraction';
import { InputField, SubmitButton } from 'presentation/components';
import str from 'utils/str';
import { SelectDecorator, SelectDecoratorOption } from 'presentation/components/form/fields/SelectDecorator';
import { parse } from 'tldts';
import GetPublicationInteractionUseCase from 'application/usecases/publications/GetPublicationInteractionUseCase';
import UpdatePublicationInteractionUseCase from 'application/usecases/publications/UpdatePublicationInteractionUseCase';
import url from 'utils/url';
import TooltipIcon from 'presentation/components/tooltip/TooltipIcon';

export interface UpdatePublicationInteractionDialogProps extends DialogOptions {
    interactionId: number;
    page: number | null;
    publicationId: number;
}

/**
 *
 * @constructor
 */
export default function UpdatePublicationInteractionDialog({
    interactionId,
    publicationId,
    page,
    onClose,
}: UpdatePublicationInteractionDialogProps): ReactElement {
    const getPublicationInteractionUseCase = Container.resolve(GetPublicationInteractionUseCase);
    const getPublicationInteractionsUseCase = Container.resolve(GetPublicationInteractionsUseCase);
    const updatePublicationInteractionsUseCase = Container.resolve(UpdatePublicationInteractionUseCase);

    const typeOptions = [
        {
            name: 'URL',
            value: 0,
        },
        {
            name: 'Page',
            value: 1,
        },
        {
            name: 'Effect',
            value: 2,
        },
        {
            name: 'Embed',
            value: 3,
        },
    ];

    const { data: publicationInteractions } = useQuery(
        () => getPublicationInteractionsUseCase.handle({
            id: publicationId,
            page: page ?? -1, // need to give page id else null won't be returned
        }),
        [GetPublicationInteractionsUseCase.name, publicationId, page],
    );

    const { data: publicationInteraction } = useQuery(
        () => getPublicationInteractionUseCase.handle(interactionId),
        [GetPublicationInteractionUseCase.name, interactionId],
    );

    const [type, setType] = useState<SelectDecoratorOption<number>>(typeOptions[0]);
    const [cropArea, setCropArea] = useState<CropEdges | null>(null);

    const {
        control,
        handleSubmit,
        setValues,
        // getValues,
        reset,
    } = useForm<PublicationInteraction>({
        defaultValues: {
            ...publicationInteraction,
        },
    });

    const effectOptions = [
        { id: 0, label: 'None' },
        ...(publicationInteractions?.effects.map(({ id, label }) => ({
            id,
            label: str.capitalize(label),
        })) || []),
    ];

    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setValues({ url: value });
    };

    async function onSubmit(values: PublicationInteraction) {
        const payload = values;

        if (type.value === 0) {
            payload.label = parse(payload.url || String()).domain || String();
            payload.linkedPage = null;
            payload.linkedArticleId = null;
        }

        if (type.value === 1) {
            payload.label = `Page ${page}`;
            payload.url = null;
            payload.linkedArticleId = publicationId;
        }

        if (type.value === 2) {
            payload.label = type.name;
            payload.linkedPage = null;
            payload.linkedArticleId = null;
            payload.url = null;
        }

        if (type.value === 3) {
            payload.label = parse(payload.urlEmbedded || String()).domain || String();
            payload.linkedPage = null;
            payload.linkedArticleId = null;
        }

        const result = await updatePublicationInteractionsUseCase.handle(payload);

        if (result) {
            useInvalidateQuery([GetPublicationInteractionsUseCase.name, publicationId, page]);
            useInvalidateQuery([GetPublicationInteractionUseCase.name, interactionId]);
            onClose();
        }

        return result;
    }

    useEffect(() => {
        if (publicationInteraction?.percentageRight) {
            setCropArea({
                percentageTop: publicationInteraction?.percentageTop ?? 0,
                percentageBottom: publicationInteraction?.percentageBottom ?? 0,
                percentageLeft: publicationInteraction?.percentageLeft ?? 0,
                percentageRight: publicationInteraction?.percentageRight ?? 0,
            });
        }
    }, [publicationInteraction?.percentageRight]);

    useEffect(() => {
        if (publicationInteraction?.url) {
            setType(typeOptions[0]);
        } else if (publicationInteraction?.linkedPage) {
            setType(typeOptions[1]);
        } else if (publicationInteraction?.effectId) {
            setType(typeOptions[2]);
        } else if (publicationInteraction?.urlEmbedded) {
            setType(typeOptions[3]);
        }
    }, [publicationInteraction]);

    useEffect((): void => {
        if (publicationInteraction) {
            reset({
                ...publicationInteraction,
                linkedPage: publicationInteraction?.linkedPage || 1,
                // ...getValues(true),
            });
        }
    }, [publicationInteraction]);

    return (
        <Box>
            <Column columns={2} gap={0} height={600}>
                <PublicationInteractionImagePreview
                    cropArea={cropArea}
                    flex={1}
                    imageScale={0.9}
                    onCropChange={(cropEdges) => setValues({ ...cropEdges })}
                    page={page}
                    publicationId={publicationId}
                    publicationType={InteractionTypes.Edit}
                />

                <Column gap={4} p={4}>
                    <Typography
                        sx={{
                            width: 'calc(100% - 80px)',
                        }}
                        variant='h2'
                    >
                        Edit interaction
                    </Typography>

                    <Column flex={1} justifyContent='space-between'>
                        <Column>
                            <SelectDecorator
                                label='Action'
                                onChange={(_, selectedOption) => {
                                    setType(selectedOption);
                                }}
                                options={[
                                    {
                                        name: 'URL',
                                        value: 0,
                                    },
                                    {
                                        name: 'Page',
                                        value: 1,
                                    },
                                    {
                                        name: 'Embed',
                                        value: 3,
                                    },
                                    {
                                        name: 'Effect',
                                        value: 2,
                                    },
                                ]}
                                value={type.value}
                            />

                            {(type.value === 0) && (
                                <Column>
                                    <InputField
                                        control={control}
                                        label='URL'
                                        name='url'
                                        onChange={handleUrlChange}
                                        rules={{
                                            required: type.value === 0 && 'This field is required',
                                            validate: (value) => {
                                                if (!value) return true;
                                                return url.isValid(value as string) ? true : 'Invalid URL format';
                                            },
                                        }}
                                        type='url'
                                    />

                                    <SelectElement
                                        control={control}
                                        label='Effect'
                                        name='effectId'
                                        options={effectOptions}
                                    />
                                </Column>
                            )}

                            {type.value === 1 && (
                                <Column>
                                    <SelectElement
                                        control={control}
                                        label='Page no.'
                                        name='linkedPage'
                                        options={Array.from({ length: publicationInteractions?.quantityPages || 0 }, (_, i) => {
                                            const id = i + 1;

                                            return {
                                                id,
                                                label: id.toString(),
                                            };
                                        })}
                                        required
                                    />

                                    <SelectElement
                                        control={control}
                                        label='Effect'
                                        name='effectId'
                                        options={effectOptions}
                                    />
                                </Column>
                            )}

                            {type.value === 2 && (
                                <SelectElement
                                    control={control}
                                    label='Effect'
                                    name='effectId'
                                    options={publicationInteractions?.effects.map(({
                                        id,
                                        label,
                                    }) => {
                                        return {
                                            id,
                                            label: str.capitalize(label),
                                        };
                                    })}
                                    required
                                />
                            )}

                            {(type.value === 3) && (
                                <Column>
                                    <InputField
                                        control={control}
                                        label='Embed URL'
                                        name='urlEmbedded'
                                        onChange={(event) => setValues({ urlEmbedded: event.target.value })}
                                        required
                                        rules={{
                                            validate: (value) => {
                                                return url.isValid(value as string) ? true : 'Invalid URL format';
                                            },
                                        }}
                                        type='url'
                                    />

                                    <Row gap={0}>
                                        <CheckboxElement
                                            control={control}
                                            label='Server embed'
                                            name='isEmbeddedViaServer'
                                            onChange={(event) => setValues({ isEmbeddedViaServer: event.target.checked })}
                                        />

                                        <TooltipIcon
                                            placement='right'
                                            text='Some hyperlinks, including videos, may be blocked due to server policies.
                                                If this happens, our server can download the file first and then send it to your browser.
                                                However, this may be slower than direct streaming.'
                                        />
                                    </Row>
                                </Column>
                            )}
                        </Column>

                        <Row gap={2} justifyContent='space-between'>
                            <Button
                                onClick={onClose}
                                size='large'
                                variant='outlined'
                            >
                                Cancel
                            </Button>

                            <SubmitButton
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                            >
                                Save changes
                            </SubmitButton>
                        </Row>
                    </Column>
                </Column>
            </Column>
        </Box>
    );
}
