import Stepper from 'presentation/components/stepper/Stepper';
import React, { useEffect, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import useSteps from 'presentation/hooks/useSteps';
import Container from 'infrastructure/services/Container';
import GetEditorPodsUseCase from 'application/usecases/newsstand/editor/GetEditorPodsUseCase';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { Button, Typography } from '@mui/material';
import FileSelect from 'presentation/components/form/buttons/FileSelect';
import { SelectElement } from 'react-hook-form-mui';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import PublicationArticleSelect from 'presentation/components/form/fields/PublicationArticleSelect';
import GetSupplementsUseCase from 'application/usecases/supplements/GetSupplementsUseCase';
import { DevTool } from '@hookform/devtools';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import { SubmitButton } from 'presentation/components';
import UpdateEditorPodsUseCase from 'application/usecases/newsstand/editor/UpdateEditorPodsUseCase';

export interface PodsModalProps extends DialogOptions {
    at: number;
}

export default function PodsModal({
    at,
    onClose,
}: PodsModalProps) {
    const getEditorPodsUseCase = Container.resolve(GetEditorPodsUseCase);
    const updateEditorPodsUseCase = Container.resolve(UpdateEditorPodsUseCase);
    const getSupplementsUseCase = Container.resolve(GetSupplementsUseCase);

    const { data: pods } = useQuery(getEditorPodsUseCase.handle, [GetEditorPodsUseCase.name]);
    const { data: supplements } = useQuery(getSupplementsUseCase.handle, [GetSupplementsUseCase.name]);

    const {
        stepper,
        completeStep,
        currentStep,
        toStep,
        stepBack,
        atStart,
        atEnd,
        stepForward,
        allStepsCompleted,
    } = useSteps(4);

    const forms = {
        0: useForm({ defaultValues: pods?.[0] }),
        1: useForm({ defaultValues: pods?.[1] }),
        2: useForm({ defaultValues: pods?.[2] }),
        3: useForm({ defaultValues: pods?.[3] }),
    };

    const {
        control,
        getValues,
        setValues,
        handleSubmit,
    } = forms[currentStep as keyof typeof forms];
    const [linkage, setLinkage] = useState(getValues().linkage);

    async function onSubmit(): Promise<boolean> {
        const result = await updateEditorPodsUseCase.handle(
            Object.values(forms)
                .map((podForm) => podForm.getValues()),
        );

        if (result) {
            onClose();
            useInvalidateQuery([GetEditorPodsUseCase.name]);
        }

        return result;
    }

    useEffect(() => {
        toStep(at);
    }, []);

    useEffect(() => {
        pods?.forEach((pod, index) => {
            if (pod.imgSrc) {
                completeStep(index);
            }
        });
    }, [pods]);

    useEffect(() => {
        setLinkage(getValues().linkage);
    }, [currentStep]);

    return (
        <Box m={4}>
            <DevTool control={control} />
            <Typography
                sx={{
                    fontSize: 24,
                    fontWeight: 600,
                    mb: 3,
                }}
            >
                {`Pod ${currentStep + 1}`}
            </Typography>

            <Stepper stepper={stepper} />

            <Column my={4}>
                <FileSelect
                    key={currentStep}
                    accepts={['.jpg', '.png', '.jpeg']}
                    control={control}
                    description='.jpg .jpeg or .png'
                    label='Pod image'
                    name='imgSrc'
                    placeholder='Choose an image (max. 5 MB)'
                />

                <SelectElement
                    key={currentStep + 100}
                    control={control}
                    label='Link type'
                    name='linkage.type'
                    onChange={(value) => setLinkage((prev) => {
                        return {
                            ...prev,
                            type: value,
                        };
                    })}
                    options={[
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
                        key={currentStep + 200}
                        control={control}
                        label='Enter the web link'
                        name='linkage.url'
                        onChange={() => {
                            setValues({
                                'linkage.articleId': null,
                                'linkage.page': null,
                            });
                        }}
                        required={false}
                    />
                )}

                {linkage?.type === 'article' && (
                    <PublicationArticleSelect
                        initialArticleId={linkage?.articleId}
                        initialPage={linkage?.page}
                        onChange={({
                            articleId,
                            page,
                        }) => {
                            setValues({
                                'linkage.url': null,
                                'linkage.articleId': articleId,
                                'linkage.page': page,
                            });
                        }}
                    />
                )}

                {linkage?.type === 'document' && (
                    <SelectElement
                        key={currentStep + 300}
                        control={control}
                        label='Select a document'
                        name='linkage.documentId'
                        options={supplements?.documents?.map((doc) => {
                            return {
                                id: doc.id,
                                label: doc.name,
                            };
                        })}
                        required={false}
                    />
                )}
            </Column>

            <Row justifyContent='space-between'>
                <Button
                    disabled={atStart}
                    onClick={stepBack}
                    size='large'
                    variant='outlined'
                >
                    Back
                </Button>

                <Row>
                    <Button
                        disabled={atEnd}
                        onClick={stepForward}
                        size='large'
                        variant='outlined'
                    >
                        Continue
                    </Button>

                    <SubmitButton
                        disabled={!allStepsCompleted}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        size='large'
                        variant='contained'
                    >
                        Save
                    </SubmitButton>
                </Row>
            </Row>
        </Box>
    );
}
