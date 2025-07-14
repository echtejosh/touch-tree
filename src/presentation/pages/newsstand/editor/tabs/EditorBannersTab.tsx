import React, { ReactElement, useEffect, useState } from 'react';
import Column from 'presentation/components/layout/Column';
import { Box, Row } from 'presentation/components/layout';
import { Typography } from '@mui/material';
import BackButton from 'presentation/components/navigation/BackButton';
import useDialog from 'presentation/hooks/useDialog';
import PlatformEditorButton from 'presentation/components/PlatformEditorButton';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { themePalette } from 'presentation/theme';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import { CloudUploadIcon } from 'presentation/components/icons';
import { EditorPodForm } from 'presentation/modals/newsstand/editor/pods/PodSetupModal';
import { SubmitButton } from 'presentation/components';
import { FormattedMessage } from 'react-intl';
import { EditorPodModel } from 'domain/models/newsstand/NewsstandModel';
import GetEditorBannersUseCase from 'application/usecases/newsstand/editor/GetEditorBannersUseCase';
import UpdateEditorBannersUseCase from 'application/usecases/newsstand/editor/UpdateEditorBannersUseCase';
import BannerSetupModal from 'presentation/modals/newsstand/editor/pods/BannerSetupModal';

export default function EditorBannersTab(): ReactElement {
    const getEditorBannersUseCase = Container.resolve(GetEditorBannersUseCase);
    const updateEditorBannersUseCase = Container.resolve(UpdateEditorBannersUseCase);

    const { createDialog } = useDialog();

    const { data: fetchedBanners } = useQuery(getEditorBannersUseCase.handle, [GetEditorBannersUseCase.name]);

    const [banners, setBanners] = useState<EditorPodModel[]>([]);

    const bannerForms: Record<number, EditorPodForm> = {
        0: useForm({ defaultValues: banners?.[0] }),
        1: useForm({ defaultValues: banners?.[1] }),
        2: useForm({ defaultValues: banners?.[2] }),
        3: useForm({ defaultValues: banners?.[3] }),
    };

    function onSetupBanner(pod: EditorPodForm, itemNum: number): void {
        createDialog((props) => <BannerSetupModal form={pod} itemNum={itemNum} {...props} />)
            .open({
                maxWidth: 'md',
            });
    }

    async function onSubmit(): Promise<boolean> {
        const _banners = Object.values(bannerForms).map((podForm) => podForm.getValues());

        const filledBanners = _banners.filter((pod) => pod.imgSrc);

        const result = await updateEditorBannersUseCase.handle(filledBanners.length ? filledBanners : null);

        if (result) {
            useInvalidateQuery([GetEditorBannersUseCase.name]);
            useInvalidateQuery([GetMetricsUseCase.name]);
        }

        return result;
    }

    useEffect(() => {
        const podsToReset = banners?.length > 0 ? banners : Array(4).fill({});

        podsToReset.forEach((pod, index) => {
            if (bannerForms[index]) {
                bannerForms[index].reset(pod);
            }
        });
    }, [banners]);

    useEffect(() => {
        setBanners(fetchedBanners || []);
    }, [fetchedBanners]);

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
                    Banners
                </Typography>

                <Row
                    alignItems='center'
                    gap={0}
                    justifyContent='space-between'
                    position='relative'
                >
                    <BackButton label='Categories' to='/newsstand/editor' />

                    <SubmitButton
                        handleSubmit={bannerForms[0].handleSubmit}
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

            <Column
                p={4}
                pt={1}
                sx={{ overflowY: 'auto' }}
            >
                <Column gap={1}>
                    <Typography variant='body2'>
                        Max 10MB. Min image size: 1000×500px
                    </Typography>

                    {/* <Typography */}
                    {/*     variant='body2' */}
                    {/* > */}
                    {/*     Please use the same 2:1 ratio for all banners to keep things consistent. */}
                    {/* </Typography> */}
                </Column>

                <Column
                    gap={2}
                >
                    {Object.entries(bannerForms).map(([key, form]) => {
                        const itemNum = Number(key) + 1;
                        const formData = form.getValues();

                        return formData?.imgSrc ? (
                            <Box
                                key={itemNum}
                                alt={`Banner ${itemNum}`}
                                component='img'
                                onClick={() => onSetupBanner(form, itemNum)}
                                src={formData?.imgSrc?.content}
                                sx={{
                                    width: '100%',
                                    aspectRatio: '2',
                                    border: '1px dashed',
                                    borderColor: themePalette.primary.main,
                                    borderRadius: 1,
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
                                icon={<CloudUploadIcon sx={{ fontSize: 40 }} />}
                                label={`Click here to setup a banner ${itemNum}`}
                                onClick={() => onSetupBanner(form, itemNum)}
                                sx={{ aspectRatio: '2 / 1' }}
                            />
                        );
                    })}
                </Column>

                {/* <Column */}
                {/*     gap={3} */}
                {/*     id='pods' */}
                {/*     sx={{ */}
                {/*         ...selectedSection === 'pods' && { */}
                {/*             borderLeft: `2px solid ${themePalette.tertiary.main}`, */}
                {/*         }, */}
                {/*     }} */}
                {/* > */}
                {/*     <Row alignItems='start' justifyContent='space-between'> */}
                {/*         <Column gap={1}> */}
                {/*             <Typography fontWeight={500}> */}
                {/*                 Squares */}
                {/*             </Typography> */}

                {/*             <Typography */}
                {/*                 variant='body2' */}
                {/*             > */}
                {/*                 Max 10MB. Min image size: 300x300 */}
                {/*             </Typography> */}
                {/*         </Column> */}
                {/*         <Switch checked={hasPods} onClick={handlePodsSwitch} /> */}
                {/*     </Row> */}

                {/*     {errorMessagePods && ( */}
                {/*         <Row> */}
                {/*             <Alert */}
                {/*                 ref={errorPodsRef} */}
                {/*                 severity='error' */}
                {/*                 sx={{ border: 'none' }} */}
                {/*             > */}
                {/*                 {errorMessagePods} */}
                {/*             </Alert> */}
                {/*         </Row> */}
                {/*     )} */}

                {/*     <Column */}
                {/*         columns={2} */}
                {/*         gap={2} */}
                {/*     > */}
                {/*         {Object.entries(podForms).map(([key, form]) => { */}
                {/*             // const { formState: { errors } } = form; */}
                {/*             const itemNum = Number(key) + 1; */}
                {/*             const formData = form.getValues(); */}

                {/*             return formData?.imgSrc ? ( */}
                {/*                 <Box */}
                {/*                     key={itemNum} */}
                {/*                     alt={`Square ${itemNum}`} */}
                {/*                     component='img' */}
                {/*                     onClick={() => onSetupPod(form, itemNum)} */}
                {/*                     src={formData?.imgSrc?.content} */}
                {/*                     sx={{ */}
                {/*                         width: '100%', */}
                {/*                         aspectRatio: '1', */}
                {/*                         border: '1px dashed', */}
                {/*                         borderColor: themePalette.primary.main, */}
                {/*                         borderRadius: 1, */}
                {/*                         objectFit: 'cover', */}

                {/*                         '&:hover': { */}
                {/*                             borderColor: themePalette.primary.main, */}
                {/*                             color: themePalette.primary.main, */}
                {/*                             cursor: 'pointer', */}
                {/*                         }, */}
                {/*                     }} */}
                {/*                 /> */}
                {/*             ) : ( */}
                {/*                 <PlatformEditorButton */}
                {/*                     key={itemNum} */}
                {/*                     disabled={!hasPods} */}
                {/*                     icon={<CloudUploadIcon sx={{ fontSize: 40 }} />} */}
                {/*                     label={`Click here to setup a square ${itemNum}`} */}
                {/*                     onClick={() => onSetupPod(form, itemNum)} */}
                {/*                 /> */}
                {/*             ); */}
                {/*         })} */}
                {/*     </Column> */}
                {/* </Column> */}
            </Column>
        </Column>
    );
}
