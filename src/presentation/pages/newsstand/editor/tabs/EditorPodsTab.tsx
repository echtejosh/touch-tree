import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Column from 'presentation/components/layout/Column';
import { Box, Row } from 'presentation/components/layout';
import { Alert, IconButton, Switch, Typography } from '@mui/material';
import BackButton from 'presentation/components/navigation/BackButton';
import useDialog from 'presentation/hooks/useDialog';
import PlatformEditorButton from 'presentation/components/PlatformEditorButton';
import Container from 'infrastructure/services/Container';
import GetEditorPodsUseCase from 'application/usecases/newsstand/editor/GetEditorPodsUseCase';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { useSearchParams } from 'react-router-dom';
import { themePalette } from 'presentation/theme';
import DeletePodsModal from 'presentation/modals/newsstand/editor/pods/DeletePodsModal';
import DeleteAdditionalPodsModal from 'presentation/modals/newsstand/editor/pods/DeleteAdditionalPodsModal';
import GetEditorAdditionalPodsUseCase from 'application/usecases/newsstand/editor/GetEditorAdditionalPodsUseCase';
import CreateEditorPodsUseCase from 'application/usecases/newsstand/editor/CreateEditorPodsUseCase';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import { CloudUploadIcon, UnfoldLessIcon, UnfoldMoreIcon } from 'presentation/components/icons';
import PodSetupModal, { EditorPodForm } from 'presentation/modals/newsstand/editor/pods/PodSetupModal';
import CreateEditorAdditionalPodsUseCase from 'application/usecases/newsstand/editor/CreateEditorAdditionalPodsUseCase';
import AdditionalPodSetupModal from 'presentation/modals/newsstand/editor/pods/AdditionalPodSetupModal';
import GetEditorPodsSettingsUseCase from 'application/usecases/newsstand/editor/GetEditorPodsSettingsUseCase';
import UpdateEditorPodsSettingsUseCase from 'application/usecases/newsstand/editor/UpdateEditorPodsSettingsUseCase';
import EditorSidebarDropdown from 'presentation/components/editor/EditorSidebarDropdown';
import { SubmitButton } from 'presentation/components';
import { FormattedMessage } from 'react-intl';
import UpdateEditorAdditionalPodUseCase from 'application/usecases/newsstand/editor/UpdateEditorAdditionalPodUseCase';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import UpdateEditorPodsUseCase from 'application/usecases/newsstand/editor/UpdateEditorPodsUseCase';

export default function EditorPodsTab(): ReactElement {
    const getEditorPodsSettingsUseCase = Container.resolve(GetEditorPodsSettingsUseCase);
    const updateEditorPodsSettingsUseCase = Container.resolve(UpdateEditorPodsSettingsUseCase);
    const updateEditorPodsUseCase = Container.resolve(UpdateEditorPodsUseCase);
    const updateEditorAdditionalPodUseCase = Container.resolve(UpdateEditorAdditionalPodUseCase);
    const getEditorPodsUseCase = Container.resolve(GetEditorPodsUseCase);
    const getEditorAdditionalPodsUseCase = Container.resolve(GetEditorAdditionalPodsUseCase);
    const createEditorPodsUseCase = Container.resolve(CreateEditorPodsUseCase);
    const createEditorAdditionalPodsUseCase = Container.resolve(CreateEditorAdditionalPodsUseCase);

    const { openDialog, createDialog } = useDialog();

    const [searchParams] = useSearchParams();

    const { data: podsSettings } = useQuery(getEditorPodsSettingsUseCase.handle, [GetEditorPodsSettingsUseCase.name]);
    const { data: fetchedPods } = useQuery(getEditorPodsUseCase.handle, [GetEditorPodsUseCase.name]);
    const { data: fetchedAdditionalPods } = useQuery(getEditorAdditionalPodsUseCase.handle, [GetEditorAdditionalPodsUseCase.name]);

    const selectedSection = searchParams.get('s');

    const errorPodsRef = useRef<HTMLDivElement | null>(null);
    const errorAdditionalPodsRef = useRef<HTMLDivElement | null>(null);

    const [pods, setPods] = useState<EditorPodModel[]>([]);
    const [additionalPods, setAdditionalPods] = useState<EditorPodModel[]>([]);

    const [hasPods, setHasPods] = useState(false);
    const [hasAdditionalPods, setHasAdditionalPods] = useState(false);
    const [hasRoundedEdges, setHasRoundedEdges] = useState(false);

    const [dropdownToggle, setDropdownToggle] = useState(true);

    const [errorMessagePods, setErrorMessagePods] = useState<string | null>(null);
    const [errorMessageAdditionalPods, setErrorMessageAdditionalPods] = useState<string | null>(null);

    const podForms: Record<number, EditorPodForm> = {
        0: useForm({ defaultValues: pods?.[0] }),
        1: useForm({ defaultValues: pods?.[1] }),
        2: useForm({ defaultValues: pods?.[2] }),
        3: useForm({ defaultValues: pods?.[3] }),
    };

    const additionalPodForms: Record<number, EditorPodForm> = {
        0: useForm({ defaultValues: additionalPods?.[0] }),
        1: useForm({ defaultValues: additionalPods?.[1] }),
    };

    function arePodsEmpty(p: EditorPodModel[] | null): boolean {
        if (!p) return true;
        return p.every((pod) => Object.keys(pod).length === 0);
    }

    function toggleDropdown(): void {
        setDropdownToggle((prev) => !prev);
    }

    function onSetupPod(pod: EditorPodForm, itemNum: number): void {
        createDialog((props) => <PodSetupModal form={pod} itemNum={itemNum} {...props} />)
            .open({
                maxWidth: 'md',
            });
    }

    function onSetupAdditionalPod(pod: EditorPodForm, itemNum: number): void {
        createDialog((props) => <AdditionalPodSetupModal form={pod} itemNum={itemNum} {...props} />)
            .open({
                maxWidth: 'md',
            });
    }

    function handlePodsSwitch(): void {
        if (hasPods) {
            openDialog((props) => <DeletePodsModal setPods={setPods} {...props} />);
        } else {
            setPods(createEditorPodsUseCase.handle());
        }
    }

    function handleAdditionalPodsSwitch(): void {
        if (hasAdditionalPods) {
            openDialog((props) => <DeleteAdditionalPodsModal setAdditionalPods={setAdditionalPods} {...props} />);
        } else {
            setAdditionalPods(createEditorAdditionalPodsUseCase.handle());
        }
    }

    async function onPodsSubmit(): Promise<boolean> {
        const podData = Object.values(podForms).map((podForm) => podForm.getValues());

        if (arePodsEmpty(podData)) {
            return updateEditorPodsUseCase.handle(null);
        }

        const hasPodImages = podData.every((pod) => pod.imgSrc);

        if (!hasPodImages) {
            setErrorMessagePods('Four images are required for the squares');
            return false;
        }

        setErrorMessagePods(null);

        return updateEditorPodsUseCase.handle(podData);
    }

    async function onPodsSettingsSubmit(): Promise<boolean> {
        return updateEditorPodsSettingsUseCase.handle({ hasRoundedEdges });
    }

    async function onAdditionalPodsSubmit(): Promise<boolean> {
        const additionalPodData = Object.values(additionalPodForms).map((podForm) => podForm.getValues());

        if (arePodsEmpty(additionalPodData)) {
            return updateEditorAdditionalPodUseCase.handle(null);
        }

        const hasAdditionalPodImages = additionalPodData.every((pod) => pod.imgSrc);

        if (!hasAdditionalPodImages) {
            setErrorMessageAdditionalPods('Two images are required for the rectangles');
            return false;
        }

        setErrorMessageAdditionalPods(null);

        return updateEditorAdditionalPodUseCase.handle(additionalPodData);
    }

    async function executeSequentially(tasks: Array<() => Promise<boolean>>): Promise<boolean> {
        return tasks.reduce(async (prevPromise, task) => {
            const prevResult = await prevPromise;
            if (!prevResult) return false;
            return task();
        }, Promise.resolve(true));
    }

    async function onSubmit(): Promise<boolean> {
        const tasks = [
            onPodsSettingsSubmit,
            onPodsSubmit,
            onAdditionalPodsSubmit,
        ];

        const allSuccessful = await executeSequentially(tasks);

        if (allSuccessful) {
            useInvalidateQuery([GetEditorPodsUseCase.name]);
            useInvalidateQuery([GetEditorPodsSettingsUseCase.name]);
            useInvalidateQuery([GetEditorAdditionalPodsUseCase.name]);
            useInvalidateQuery([GetMetricsUseCase.name]);
        }

        return allSuccessful;
    }

    useEffect(() => {
        if (errorMessagePods && errorPodsRef.current) {
            errorPodsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errorMessagePods]);

    useEffect(() => {
        if (errorMessageAdditionalPods && errorAdditionalPodsRef.current) {
            errorAdditionalPodsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errorMessageAdditionalPods]);

    useEffect(() => {
        const podsToReset = pods?.length > 0 ? pods : Array(4).fill({});

        podsToReset.forEach((pod, index) => {
            if (podForms[index]) {
                podForms[index].reset(pod);
            }
        });
    }, [pods]);

    useEffect(() => {
        const additionalPodsToReset = additionalPods?.length > 0 ? additionalPods : Array(2).fill({});

        additionalPodsToReset.forEach((pod, index) => {
            if (additionalPodForms[index]) {
                additionalPodForms[index].reset(pod);
            }
        });
    }, [additionalPods]);

    useEffect(() => {
        if (selectedSection) {
            const targetElement = document.getElementById(`${selectedSection}`);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [selectedSection]);

    useEffect(() => {
        setHasPods(Boolean(pods?.length));
    }, [pods]);

    useEffect(() => {
        setHasAdditionalPods(Boolean(additionalPods?.length));
    }, [additionalPods]);

    useEffect(() => {
        setPods(fetchedPods || []);
    }, [fetchedPods]);

    useEffect(() => {
        setAdditionalPods(fetchedAdditionalPods || []);
    }, [fetchedAdditionalPods]);

    useEffect(() => {
        setHasRoundedEdges(Boolean(podsSettings?.hasRoundedEdges));
    }, [podsSettings]);

    return (
        <Column gap={0} width={560}>
            {/*
              <Column gap={0}> is required here to handle cases where the children's
              width exceeds the viewport width. It also ensures proper scroll behavior for overflow content.
              Do not remove or modify unless absolutely necessary.
            */}
            <Box m={4}>
                <Typography
                    mb={2}
                    variant='h2'
                >
                    Pods
                </Typography>

                <Row
                    alignItems='center'
                    gap={0}
                    justifyContent='space-between'
                    position='relative'
                >
                    <BackButton label='Categories' to='/newsstand/editor' />

                    <Row
                        gap={2}
                    >
                        <IconButton
                            onClick={toggleDropdown}
                            sx={{
                                color: themePalette.text.main,
                            }}
                        >
                            {dropdownToggle ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                        </IconButton>

                        <SubmitButton
                            handleSubmit={podForms[0].handleSubmit}
                            onSubmit={onSubmit}
                            size='large'
                        >
                            <FormattedMessage
                                defaultMessage='Save changes'
                                id='button.save'
                            />
                        </SubmitButton>
                    </Row>
                </Row>
            </Box>

            <Column
                gap={0}
                pb={4}
                sx={{ overflowY: 'auto' }}
            >
                <EditorSidebarDropdown
                    label='Settings'
                    open={dropdownToggle}
                >
                    <Row
                        alignItems='start'
                        justifyContent='space-between'
                        px={1.5}
                    >
                        <Typography>
                            Apply rounded edges to interface
                        </Typography>
                        <Switch
                            checked={hasRoundedEdges}
                            onChange={(_, checked) => {
                                setHasRoundedEdges(checked);
                            }}
                        />
                    </Row>
                </EditorSidebarDropdown>

                <EditorSidebarDropdown
                    label='Pods'
                    open={dropdownToggle}
                >
                    <Column
                        gap={3}
                        id='pods'
                        px={1.5}
                        sx={{
                            ...selectedSection === 'pods' && {
                                borderLeft: `2px solid ${themePalette.tertiary.main}`,
                            },
                        }}
                    >
                        <Row alignItems='start' justifyContent='space-between'>
                            <Column gap={1}>
                                <Typography fontWeight={500}>
                                    Squares
                                </Typography>

                                <Typography
                                    variant='body2'
                                >
                                    Max 10MB. Min image size: 300×300px
                                </Typography>
                            </Column>

                            <Switch checked={hasPods} onClick={handlePodsSwitch} />
                        </Row>

                        {errorMessagePods && (
                            <Row>
                                <Alert
                                    ref={errorPodsRef}
                                    severity='error'
                                    sx={{ border: 'none' }}
                                >
                                    {errorMessagePods}
                                </Alert>
                            </Row>
                        )}

                        <Column
                            columns={2}
                            gap={2}
                        >
                            {Object.entries(podForms).map(([key, form]) => {
                                // const { formState: { errors } } = form;
                                const itemNum = Number(key) + 1;
                                const formData = form.getValues();

                                return formData?.imgSrc ? (
                                    <Box
                                        key={itemNum}
                                        alt={`Square ${itemNum}`}
                                        component='img'
                                        onClick={() => onSetupPod(form, itemNum)}
                                        src={formData?.imgSrc?.content}
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '1',
                                            border: '1px dashed',
                                            borderColor: themePalette.primary.main,
                                            borderRadius: hasRoundedEdges ? 1 : 0,
                                            objectFit: 'cover',

                                            '&:hover': {
                                                borderColor: themePalette.primary.main,
                                                color: themePalette.primary.main,
                                                cursor: 'pointer',
                                            },
                                        }}
                                    />
                                ) : (
                                    <PlatformEditorButton
                                        key={itemNum}
                                        disabled={!hasPods}
                                        icon={<CloudUploadIcon sx={{ fontSize: 40 }} />}
                                        label={`Click here to setup a square ${itemNum}`}
                                        onClick={() => onSetupPod(form, itemNum)}
                                    />
                                );
                            })}
                        </Column>
                    </Column>

                    <Column
                        gap={2}
                        id='rects'
                        px={1.5}
                        sx={{
                            ...selectedSection === 'rects' && {
                                borderLeft: `2px solid ${themePalette.tertiary.main}`,
                            },
                        }}
                    >
                        <Row alignItems='center' justifyContent='space-between'>
                            <Column gap={1}>
                                <Typography fontWeight={500}>
                                    Rectangles
                                </Typography>

                                <Typography
                                    variant='body2'
                                >
                                    Max 10MB. Min image size: 300×150px
                                </Typography>
                            </Column>

                            <Switch checked={hasAdditionalPods} onClick={handleAdditionalPodsSwitch} />
                        </Row>

                        {errorMessageAdditionalPods && (
                            <Row>
                                <Alert
                                    ref={errorAdditionalPodsRef}
                                    severity='error'
                                    sx={{ border: 'none' }}
                                >
                                    {errorMessageAdditionalPods}
                                </Alert>
                            </Row>
                        )}

                        <Column
                            columns={2}
                            gap={2}
                        >
                            {Object.entries(additionalPodForms).map(([key, form]) => {
                                // const { formState: { errors } } = form;
                                const itemNum = Number(key) + 1;
                                const formData = form.getValues();

                                return formData?.imgSrc ? (
                                    <Box
                                        key={itemNum}
                                        alt={`Rectangle ${itemNum}`}
                                        component='img'
                                        onClick={() => onSetupAdditionalPod(form, itemNum)}
                                        src={formData?.imgSrc?.content}
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '2 / 1',
                                            border: '1px dashed',
                                            borderColor: themePalette.primary.main,
                                            borderRadius: hasRoundedEdges ? 1 : 0,
                                            objectFit: 'cover',

                                            '&:hover': {
                                                borderColor: themePalette.primary.main,
                                                color: themePalette.primary.main,
                                                cursor: 'pointer',
                                            },
                                        }}
                                    />
                                ) : (
                                    <PlatformEditorButton
                                        key={itemNum}
                                        disabled={!hasAdditionalPods}
                                        icon={<CloudUploadIcon sx={{ fontSize: 40 }} />}
                                        label={`Click here to setup a rectangle ${itemNum}`}
                                        onClick={() => onSetupAdditionalPod(form, itemNum)}
                                        sx={{ aspectRatio: '2 / 1' }}
                                    />
                                );
                            })}
                        </Column>
                    </Column>
                </EditorSidebarDropdown>
            </Column>
        </Column>
    );
}
