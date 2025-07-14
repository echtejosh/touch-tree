import React, { ReactElement, useRef, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import { useForm, useInvalidateQuery, usePrefetchQuery } from 'presentation/hooks';
import { CampaignModel } from 'domain/models/CampaignModel';
import { Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { SubmitButton } from 'presentation/components';
import GetCampaignsUseCase from 'application/usecases/campaigns/GetCampaignsUseCase';
import PublicationArticleSelect, {
    PublicationArticleSelectRefMethods,
} from 'presentation/components/form/fields/PublicationArticleSelect';
import { SelectDecorator } from 'presentation/components/form/fields/SelectDecorator';
import useSteps from 'presentation/hooks/useSteps';
import Stepper from 'presentation/components/stepper/Stepper';
import { CheckboxElement } from 'react-hook-form-mui';
import CampaignAdvertSelectTab from 'presentation/modals/campaigns/tabs/CampaignAdvertSelectTab';
import CreateCampaignUseCase from 'application/usecases/campaigns/CreateCampaignUseCase';
import useDialog from 'presentation/hooks/useDialog';
import UpdateCampaignModal from 'presentation/modals/campaigns/UpdateCampaignModal';
import { DialogOptions } from 'presentation/providers/DialogProvider';
import GetCampaignUseCase from 'application/usecases/campaigns/GetCampaignUseCase';
import { AccessTimeIcon, WifiIcon, MapIcon } from 'presentation/components/icons';

export default function CreateCampaignModal({ onClose }: DialogOptions): ReactElement {
    const createCampaignUseCase = Container.resolve(CreateCampaignUseCase);
    const getCampaignUseCase = Container.resolve(GetCampaignUseCase);

    const {
        stepper,
        stepBack,
        atStart,
        currentStep,
        completeStep,
        stepForward,
    } = useSteps(3);

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        setValues,
    } = useForm<CampaignModel>();

    const { openDialog } = useDialog();

    const [linkType, setLinkType] = useState<number>(0);
    const [campaignType, setCampaignType] = useState(3);
    const [error, setError] = useState<string | null>(null);

    const publicationRef = useRef<PublicationArticleSelectRefMethods | null>(null);

    async function onSubmit(values: CampaignModel): Promise<boolean> {
        const result = await createCampaignUseCase.handle(values);

        if (result && typeof result === 'object' && !result.success) {
            setError(result.serverStatus || 'An error occurred');
            return false;
        }

        /**
         * Create a campaign and navigate to the update modal afterward
         * this helps to separate the concerns of create and update
         * since the campaign type tab isn't inherently part of the create api
         * but visually is in the UI.
         */

        if (typeof result === 'number') {
            /**
             * Prepare the prefetch since we are switching from create to update modal
             */

            useInvalidateQuery([GetCampaignsUseCase.name]);
            useInvalidateQuery([GetCampaignUseCase.name, result]);

            usePrefetchQuery(
                () => getCampaignUseCase.handle(result as number),
                [GetCampaignUseCase.name, result],
            );

            onClose();

            openDialog((props) => (
                <UpdateCampaignModal
                    id={result as number}
                    selectedType={campaignType}
                    step={2}
                    {...props}
                />
            ));
        }

        return Boolean(result);
    }

    return (
        <Box>
            <Typography p={4} variant='h2'>
                Create a new campaign
            </Typography>

            {error && (
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    open={Boolean(error)}
                >
                    <Alert onClose={() => setError(null)} severity='error'>
                        {error}
                    </Alert>
                </Snackbar>
            )}

            <Box m={4} mt={0}>
                <Stepper stepper={stepper} />
            </Box>

            <Column mt={1} p={4} pt={0}>
                {currentStep === 0 && (
                    <Column>
                        <Row fill>
                            <FormTextField
                                control={control}
                                fullWidth
                                label='Name'
                                name='name'
                            />
                        </Row>

                        <Typography fontWeight={600}>
                            Campaign type
                        </Typography>

                        <FormControl>
                            <RadioGroup
                                onChange={(event) => setCampaignType(Number(event.target.value))}
                                value={campaignType}
                            >
                                <Row fill>
                                    <Box>
                                        <Box
                                            sx={{
                                                height: 120,
                                                background: '#efefef',
                                                borderRadius: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <AccessTimeIcon
                                                sx={{
                                                    fontSize: 58,
                                                    color: 'lightgray',
                                                }}
                                            />
                                        </Box>

                                        <FormControlLabel
                                            control={<Radio />}
                                            label='Time-based'
                                            value={3}
                                        />
                                        <Typography variant='body2'>
                                            Campaign that targets a specific time period
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Box
                                            sx={{
                                                height: 120,
                                                background: '#efefef',
                                                borderRadius: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <MapIcon
                                                sx={{
                                                    fontSize: 58,
                                                    color: 'lightgray',
                                                }}
                                            />
                                        </Box>

                                        <FormControlLabel
                                            control={<Radio />}
                                            label='Geo-location'
                                            value={1}
                                        />
                                        <Typography
                                            variant='body2'
                                        >
                                            Campaign that targets a specific location
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Box
                                            sx={{
                                                height: 120,
                                                background: '#efefef',
                                                borderRadius: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <WifiIcon
                                                sx={{
                                                    fontSize: 58,
                                                    color: 'lightgray',
                                                }}
                                            />
                                        </Box>

                                        <FormControlLabel
                                            control={<Radio />}
                                            label='IP-address'
                                            value={2}
                                        />
                                        <Typography
                                            variant='body2'
                                        >
                                            Campaign that targets a specific IP address
                                        </Typography>

                                    </Box>
                                </Row>
                            </RadioGroup>
                        </FormControl>

                        <Typography fontWeight={600}>
                            Add a link
                        </Typography>

                        <SelectDecorator
                            label='Link as'
                            onChange={(value) => {
                                setLinkType(value);

                                if (value === 0) {
                                    setValues({
                                        linkedPage: null,
                                        linkedArticleId: null,
                                    });
                                }
                            }}
                            options={[
                                {
                                    value: 0,
                                    name: 'None',
                                },
                                {
                                    value: 1,
                                    name: 'Publication',
                                },
                            ]}
                            value={linkType}
                        />

                        {linkType === 1 && (
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

                        <Typography fontWeight={600}>
                            Duration
                        </Typography>

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

                        <Column gap={0}>
                            <CheckboxElement
                                control={control}
                                label='Registration form'
                                name='hasEmailRegistration'
                            />

                            <CheckboxElement
                                control={control}
                                label='Email validation'
                                name='hasEmailAccess'
                            />
                        </Column>
                    </Column>
                )}

                {currentStep === 1 && (
                    <Column>
                        <Typography fontWeight={600} mt={-1}>
                            Manage adverts
                        </Typography>

                        <Row alignItems='center' gap={2}>
                            <CampaignAdvertSelectTab
                                ids={getValues().advertIds || []}
                                onChange={(ids) => setValues({ advertIds: ids.map((item) => Number(item)) })}
                            />
                        </Row>
                    </Column>
                )}
            </Column>

            <Row gap={2} justifyContent='space-between' m={4} mt={0}>
                <Button
                    disabled={atStart}
                    onClick={() => {
                        stepBack();
                        completeStep(currentStep - 1, false);
                    }}
                    size='large'
                    variant='outlined'
                >
                    Back
                </Button>

                <Row>
                    {currentStep === 0 && (
                        <Button
                            onClick={handleSubmit(async () => {
                                if (linkType === 1 && !await publicationRef.current?.submit()) return;

                                stepForward();
                                completeStep(currentStep);
                            })}
                            size='large'
                            variant='contained'
                        >
                            Continue
                        </Button>
                    )}

                    {currentStep === 1 && (
                        <SubmitButton
                            handleSubmit={handleSubmit}
                            onSubmit={(values) => {
                                return onSubmit(values);
                            }}
                            size='large'
                        >
                            Continue
                        </SubmitButton>
                    )}

                    {/* {currentStep === 2 && ( */}
                    {/*     <Button */}
                    {/*         onClick={() => { */}
                    {/*             stepForward(); */}
                    {/*             completeStep(currentStep); */}
                    {/*         }} */}
                    {/*         size='large' */}
                    {/*         variant='contained' */}
                    {/*     > */}
                    {/*         <FormattedMessage id='button.create-campaign' /> */}
                    {/*     </Button> */}
                    {/* )} */}
                </Row>
            </Row>
        </Box>
    );
}
