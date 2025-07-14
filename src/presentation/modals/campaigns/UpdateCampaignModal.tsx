import React, { ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Column, Row } from 'presentation/components/layout';
import FormTextField from 'presentation/components/form/fields/FormTextField';
import Container from 'infrastructure/services/Container';
import GetCampaignUseCase from 'application/usecases/campaigns/GetCampaignUseCase';
import { useForm, useInvalidateQuery, useQuery } from 'presentation/hooks';
import { CampaignModel } from 'domain/models/CampaignModel';
import { Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, Alert, Snackbar } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { SubmitButton } from 'presentation/components';
import UpdateCampaignUseCase from 'application/usecases/campaigns/UpdateCampaignUseCase';
import { FormattedMessage } from 'react-intl';
import GetCampaignsUseCase from 'application/usecases/campaigns/GetCampaignsUseCase';
import PublicationArticleSelect, {
    PublicationArticleSelectRefMethods,
} from 'presentation/components/form/fields/PublicationArticleSelect';
import { SelectDecorator } from 'presentation/components/form/fields/SelectDecorator';
import useSteps from 'presentation/hooks/useSteps';
import Stepper from 'presentation/components/stepper/Stepper';
import { CheckboxElement } from 'react-hook-form-mui';
import CampaignAdvertSelectTab from 'presentation/modals/campaigns/tabs/CampaignAdvertSelectTab';
import AccessDurationSelect from 'presentation/components/AccessDurationSelect';
import CampaignIpAddressesTab from 'presentation/modals/campaigns/tabs/CampaignIpAddressesTab';
import CampaignGeoCoordinatesTab from 'presentation/modals/campaigns/tabs/CampaignGeoCoordinatesTab';
import { AccessTimeIcon, WifiIcon, MapIcon } from 'presentation/components/icons';
import { DialogOptions } from 'presentation/providers/DialogProvider';

const CampaignType = {
    TimeBased: 3,
    GeoLocation: 1,
    IpAddress: 2,
};

const LinkType = {
    None: 0,
    Publication: 1,
};

type CampaignTypes = typeof CampaignType[keyof typeof CampaignType];
type LinkTypes = typeof LinkType[keyof typeof LinkType];

const campaignTypeBoxStyle = {
    height: 120,
    background: '#efefef',
    borderRadius: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const iconStyle = {
    fontSize: 58,
    color: 'lightgray',
};

export interface CampaignEditModalProps extends DialogOptions {
    id: number;
    step?: number;
    selectedType?: number;
}

export default function UpdateCampaignModal({
    id,
    step,
    selectedType,
    onClose,
}: CampaignEditModalProps): ReactElement {
    const updateCampaignUseCase = Container.resolve(UpdateCampaignUseCase);
    const getCampaignUseCase = Container.resolve(GetCampaignUseCase);

    const { data: campaign } = useQuery(() => getCampaignUseCase.handle(id), [GetCampaignUseCase.name, id]);

    const {
        stepper,
        stepBack,
        atStart,
        atEnd,
        currentStep,
        completeStep,
        stepForward,
        toStep,
    } = useSteps(3);

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        setValues,
        reset,
    } = useForm<CampaignModel>({
        defaultValues: {
            ...campaign,
            advertIds: campaign?.adverts?.flatMap((item) => item.id) || [],
        },
    });

    const [isInitialized, setIsInitialized] = useState(false);
    const [linkType, setLinkType] = useState<number>(LinkType.None);
    const [campaignType, setCampaignType] = useState(CampaignType.TimeBased);
    const [showGeoError, setShowGeoError] = useState(false);
    const [showIpError, setShowIpError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const publicationRef = useRef<PublicationArticleSelectRefMethods | null>(null);

    const hasGeoCoordinates = useMemo(() => Boolean(campaign?.coordinates?.length),
        [campaign?.coordinates],
    );

    const hasIpAddresses = useMemo(() => Boolean(campaign?.ips?.length),
        [campaign?.ips],
    );

    const isGeoLocationCampaign = useMemo(() => campaignType === CampaignType.GeoLocation,
        [campaignType],
    );

    const isIpAddressCampaign = useMemo(() => campaignType === CampaignType.IpAddress,
        [campaignType],
    );

    const isNewCampaign = useMemo(() => {
        if (!campaign?.dateCreated) return false;

        const now = Math.floor(Date.now() / 1000);
        const diff = Math.abs(now - campaign.dateCreated);
        const sec = 15;
        return diff <= sec;
    }, [campaign?.dateCreated]);

    function isCampaignTypeDisabled(type: CampaignTypes): boolean {
        const disabledConditions: Record<CampaignTypes, boolean> = {
            [CampaignType.TimeBased]: (isGeoLocationCampaign && hasGeoCoordinates) || (isIpAddressCampaign && hasIpAddresses),
            [CampaignType.GeoLocation]: isIpAddressCampaign && hasIpAddresses,
            [CampaignType.IpAddress]: isGeoLocationCampaign && hasGeoCoordinates,
        };

        return disabledConditions[type] || false;
    }

    useEffect(() => {
        if (isGeoLocationCampaign && hasGeoCoordinates && showGeoError) {
            setShowGeoError(false);
        }
    }, [isGeoLocationCampaign, hasGeoCoordinates, showGeoError]);

    useEffect(() => {
        if (isIpAddressCampaign && hasIpAddresses && showIpError) {
            setShowIpError(false);
        }
    }, [isIpAddressCampaign, hasIpAddresses, showIpError]);

    useEffect(() => {
        if (campaign && !isInitialized) {
            reset({
                ...campaign,
                advertIds: campaign?.adverts?.flatMap((item) => item.id) || [],
            });
            setIsInitialized(true);
        }
    }, [campaign, isInitialized]);

    useEffect(() => {
        if (step) {
            completeStep(0);
            completeStep(1);
            toStep(step);
        }
    }, []);

    useEffect(() => {
        if (selectedType) {
            setLinkType(campaign?.linkedArticleId ? LinkType.Publication : LinkType.None);
            setCampaignType(selectedType);
        } else if (campaign?.type) {
            setCampaignType(campaign.type);
        }
    }, [campaign?.type, selectedType]);

    useEffect(() => {
        if (campaign?.linkedArticleId) {
            setLinkType(LinkType.Publication);
        }
    }, [campaign?.linkedArticleId]);

    function validateCampaignData(): boolean {
        if (isGeoLocationCampaign && !hasGeoCoordinates) {
            setShowGeoError(true);
            return false;
        }

        if (isIpAddressCampaign && !hasIpAddresses) {
            setShowIpError(true);
            return false;
        }

        return true;
    }

    function handleLinkTypeChange(value: LinkTypes): void {
        setLinkType(value);

        if (value === LinkType.None) {
            setValues({
                linkedPage: null,
                linkedArticleId: null,
            });
        }
    }

    async function onSubmit(values: CampaignModel): Promise<boolean> {
        if (!validateCampaignData()) {
            return false;
        }

        const result = await updateCampaignUseCase.handle(values);

        if (!result.success) {
            setError(result.serverStatus || 'An error occurred');
            return false;
        }

        useInvalidateQuery([GetCampaignsUseCase.name]);
        useInvalidateQuery([GetCampaignUseCase.name, id]);
        onClose();

        return result.success;
    }

    interface CampaignTypeOptionProps {
        type: CampaignTypes;
        icon: ReactNode;
        label: string;
        description: string;
    }

    function renderCampaignTypeOption(config: CampaignTypeOptionProps): ReactElement {
        const { type, icon, label, description } = config;
        const isDisabled = isCampaignTypeDisabled(type);

        return (
            <Box>
                <Box sx={campaignTypeBoxStyle}>
                    {icon}
                </Box>
                <FormControlLabel
                    control={<Radio />}
                    disabled={isDisabled}
                    label={label}
                    value={type}
                />
                <Typography
                    sx={{ color: isDisabled ? '#a8a8a8' : 'black' }}
                    variant='body2'
                >
                    {description}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography p={4} variant='h2'>
                {campaign?.name}
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
                                    {renderCampaignTypeOption({
                                        type: CampaignType.TimeBased,
                                        icon: <AccessTimeIcon sx={iconStyle} />,
                                        label: 'Time-based',
                                        description: 'Campaign that targets a specific time period',
                                    })}

                                    {renderCampaignTypeOption({
                                        type: CampaignType.GeoLocation,
                                        icon: <MapIcon sx={iconStyle} />,
                                        label: 'Geo-location',
                                        description: 'Campaign that targets a specific location',
                                    })}

                                    {renderCampaignTypeOption({
                                        type: CampaignType.IpAddress,
                                        icon: <WifiIcon sx={iconStyle} />,
                                        label: 'IP-address',
                                        description: 'Campaign that targets a specific IP address',
                                    })}
                                </Row>
                            </RadioGroup>
                        </FormControl>

                        <Typography fontWeight={600}>
                            Add a link
                        </Typography>

                        <SelectDecorator
                            label='Link as'
                            onChange={handleLinkTypeChange}
                            options={[
                                {
                                    value: LinkType.None,
                                    name: 'None',
                                },
                                {
                                    value: LinkType.Publication,
                                    name: 'Publication',
                                },
                            ]}
                            value={linkType}
                        />

                        {linkType === LinkType.Publication && (
                            <PublicationArticleSelect
                                ref={publicationRef}
                                initialArticleId={campaign?.linkedArticleId}
                                initialPage={campaign?.linkedPage}
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
                                ids={getValues().advertIds}
                                onChange={(ids) => setValues({ advertIds: ids.map((item) => Number(item)) })}
                            />
                        </Row>
                    </Column>
                )}

                {currentStep === 2 && (
                    <Column>
                        <AccessDurationSelect
                            onChange={(value) => setValues({ tokenTypeId: value })}
                            value={getValues()?.tokenTypeId || 7}
                        />

                        {isGeoLocationCampaign && (
                            <>
                                <CampaignGeoCoordinatesTab
                                    id={campaign?.id as number}
                                />

                                {showGeoError && (
                                    <Alert severity='error' sx={{ border: 'none' }}>
                                        Please add at least one geo coordinate for this campaign.
                                    </Alert>
                                )}
                            </>
                        )}
                        {isIpAddressCampaign && (
                            <>
                                <CampaignIpAddressesTab id={campaign?.id as number} />

                                {showIpError && (
                                    <Alert severity='error' sx={{ border: 'none' }}>
                                        Please add at least one IP address for this campaign.
                                    </Alert>
                                )}
                            </>
                        )}
                    </Column>
                )}
            </Column>

            <Row gap={2} justifyContent='space-between' m={4} mt={0}>
                <Button
                    disabled={atStart}
                    onClick={stepBack}
                    size='large'
                    variant='outlined'
                >
                    Back
                </Button>

                <Row>
                    {atEnd ? (
                        <SubmitButton
                            handleSubmit={handleSubmit}
                            onSubmit={(values) => {
                                stepForward();
                                completeStep(currentStep);

                                return onSubmit({ ...campaign, ...values });
                            }}
                            size='large'
                        >
                            {isNewCampaign ? (<FormattedMessage id='button.create-campaign' />) : (<FormattedMessage id='button.save' />)}
                        </SubmitButton>
                    ) : (
                        <Button
                            onClick={handleSubmit(async () => {
                                if (atStart && linkType === LinkType.Publication && !await publicationRef.current?.submit()) return;

                                stepForward();
                                completeStep(currentStep);
                            })}
                            size='large'
                            variant='contained'
                        >
                            Continue
                        </Button>
                    )}
                </Row>
            </Row>
        </Box>
    );
}
