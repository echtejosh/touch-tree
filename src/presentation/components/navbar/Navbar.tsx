import React, { ReactElement } from 'react';
import { Drawer, SvgIcon, ThemeProvider } from '@mui/material';
import { useAuth, usePrefetchQuery } from 'presentation/hooks';
import { Box, Column, Row } from 'presentation/components/layout';
import { FormattedMessage, useIntl } from 'react-intl';

import {
    NavbarLogo,
    NavbarLink,
    NavbarButton,
} from 'presentation/components/navbar';

import {
    AdvertIcon,
    CampaignIcon, DashboardIcon,
    HighlightIcon, LayersIcon,
    LogoutIcon,
    NewsstandIcon, PublicationsIcon,
    SettingsIcon, StatisticsIcon, SupplementsIcon,
} from 'presentation/components/icons';

import { menuTheme } from 'presentation/theme';
import Preload from 'presentation/components/preload/Preload';
import Container from 'infrastructure/services/Container';
import GetAdvertsUseCase from 'application/usecases/adverts/GetAdvertsUseCase';
import useDialog from 'presentation/hooks/useDialog';
import SettingsModal from 'presentation/modals/settings/SettingsModal';
import { GetAccountUseCase } from 'application/usecases/account/GetAccountPasswordUseCase';
import { GetMetricsUseCase } from 'application/usecases/metrics/GetMetricsUseCase';
import GetHighlightsUseCase from 'application/usecases/highlights/GetHighlightsUseCase';
import GetCampaignsUseCase from 'application/usecases/campaigns/GetCampaignsUseCase';
import { getCurrentTheme } from 'presentation/themes/themeSelect';
import { useNavbarExpansionContext } from 'presentation/hooks/context/useNavbarExpansionContext';
import SidebarLeftSvg from 'presentation/assets/sidebar-left.svg?react';
import SidebarRightSvg from 'presentation/assets/sidebar-right.svg?react';

export default function Navbar(): ReactElement {
    const getMetricsUseCase = Container.resolve(GetMetricsUseCase);
    const getAdvertsUseCase = Container.resolve(GetAdvertsUseCase);
    const getHighlightsUseCase = Container.resolve(GetHighlightsUseCase);
    const getCampaignsUseCase = Container.resolve(GetCampaignsUseCase);
    const getAccountUseCase = Container.resolve(GetAccountUseCase);
    const theme = getCurrentTheme();

    const { formatMessage } = useIntl();
    const { loggedIn } = useAuth();
    const { openDialog } = useDialog();

    const { expanded, drawerWidth, setExpanded, handleMouseEnter, handleMouseLeave } = useNavbarExpansionContext();

    function openSettingsDialog(): void {
        openDialog((): ReactElement => <SettingsModal />);
    }

    return (
        <ThemeProvider theme={menuTheme}>
            <Drawer
                anchor='left'
                ModalProps={{ hideBackdrop: true }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                open
                sx={{
                    flexShrink: 0,
                    position: 'absolute',
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        overflowX: 'hidden',
                        transition: 'width 0.3s ease',
                        zIndex: 1000,
                    },
                }}
                variant='permanent'
            >
                {loggedIn && (
                    <Column height='100%' justifyContent='space-between'>
                        <Box>
                            <NavbarLogo collapsed={!expanded} />

                            <Column>
                                <Row>
                                    {expanded ? (
                                        <NavbarButton onClick={() => setExpanded(false)}>
                                            <SvgIcon component={SidebarLeftSvg} inheritViewBox sx={{ fill: 'none' }} />
                                        </NavbarButton>
                                    ) : (
                                        <NavbarButton
                                            collapsed={!expanded}
                                            onClick={() => setExpanded(true)}
                                            tooltipTitle={formatMessage({ id: 'navbar.expand' })}
                                        >
                                            <SvgIcon component={SidebarRightSvg} inheritViewBox sx={{ fill: 'none' }} />
                                        </NavbarButton>
                                    )}
                                </Row>

                                <Column gap={0.5}>
                                    {!theme?.subset && (
                                        <Preload on={() => usePrefetchQuery(getMetricsUseCase.handle, [GetMetricsUseCase.name])}>
                                            <NavbarLink
                                                collapsed={!expanded}
                                                icon={<DashboardIcon />}
                                                label={formatMessage({ id: 'navbar.dashboard' })}
                                                to='/dashboard'
                                                tooltipTitle={!expanded ? formatMessage({ id: 'navbar.dashboard' }) : ''}
                                            />
                                        </Preload>
                                    )}

                                    <NavbarLink
                                        category={false}
                                        collapsed={!expanded}
                                        icon={<LayersIcon />}
                                        label={formatMessage({ id: 'navbar.newsstand' })}
                                        to='/newsstand'
                                        tooltipTitle={!expanded ? formatMessage({ id: 'navbar.newsstand' }) : ''}
                                    />

                                    <NavbarLink
                                        aliases={[
                                            '/newsstand/editor/colors',
                                            '/newsstand/editor/pods',
                                            '/newsstand/editor/logo',
                                            '/newsstand/editor/browser',
                                        ]}
                                        collapsed={!expanded}
                                        icon={<NewsstandIcon />}
                                        label={formatMessage({ id: 'navbar.newsstand.editor' })}
                                        to='/newsstand/editor'
                                        tooltipTitle={!expanded ? formatMessage({ id: 'navbar.newsstand.editor' }) : ''}
                                    />

                                    {!theme?.subset && (
                                        <NavbarLink
                                            collapsed={!expanded}
                                            icon={<PublicationsIcon />}
                                            label={formatMessage({ id: 'navbar.newsstand.publications' })}
                                            to='/newsstand/publications'
                                            tooltipTitle={!expanded ? formatMessage({ id: 'navbar.newsstand.publications' }) : ''}
                                        />
                                    )}

                                    <NavbarLink
                                        collapsed={!expanded}
                                        icon={<SupplementsIcon />}
                                        label={formatMessage({ id: 'navbar.newsstand.supplements' })}
                                        to='/newsstand/supplements'
                                        tooltipTitle={!expanded ? formatMessage({ id: 'navbar.newsstand.supplements' }) : ''}
                                    />

                                    {!theme.subset && (
                                        <Preload on={() => usePrefetchQuery(getCampaignsUseCase.handle, [GetCampaignsUseCase.name])}>
                                            <NavbarLink
                                                collapsed={!expanded}
                                                icon={<CampaignIcon />}
                                                label={formatMessage({ id: 'navbar.campaigns' })}
                                                to='/campaigns'
                                                tooltipTitle={!expanded ? formatMessage({ id: 'navbar.campaigns' }) : ''}
                                            />
                                        </Preload>
                                    )}

                                    {!theme.subset && (
                                        <Preload on={() => usePrefetchQuery(getAdvertsUseCase.handle, [GetAdvertsUseCase.name])}>
                                            <NavbarLink
                                                collapsed={!expanded}
                                                icon={<AdvertIcon />}
                                                label={formatMessage({ id: 'navbar.adverts' })}
                                                to='/adverts'
                                                tooltipTitle={!expanded ? formatMessage({ id: 'navbar.adverts' }) : ''}
                                            />
                                        </Preload>
                                    )}

                                    {theme.subset && (
                                        <>
                                            <Preload on={() => {}}>
                                                <NavbarLink
                                                    collapsed={!expanded}
                                                    icon={<HighlightIcon />}
                                                    label='Media'
                                                    to='/media'
                                                    tooltipTitle={!expanded ? 'Media' : ''}
                                                />
                                            </Preload>

                                            <Preload on={() => {}}>
                                                <NavbarLink
                                                    collapsed={!expanded}
                                                    icon={<AdvertIcon />}
                                                    label='Adverts'
                                                    to='/relation-adverts'
                                                    tooltipTitle={!expanded ? 'Adverts' : ''}
                                                />
                                            </Preload>
                                        </>
                                    )}

                                    {!theme.subset && (
                                        <Preload on={() => usePrefetchQuery(getHighlightsUseCase.handle, [GetHighlightsUseCase.name])}>
                                            <NavbarLink
                                                collapsed={!expanded}
                                                icon={<HighlightIcon />}
                                                label={formatMessage({ id: 'navbar.highlights' })}
                                                to='/highlights'
                                                tooltipTitle={!expanded ? formatMessage({ id: 'navbar.highlights' }) : ''}
                                            />
                                        </Preload>
                                    )}

                                    {!theme.subset && (
                                        <NavbarLink
                                            collapsed={!expanded}
                                            icon={<StatisticsIcon />}
                                            label={formatMessage({ id: 'navbar.statistics' })}
                                            to='/statistics'
                                            tooltipTitle={!expanded ? formatMessage({ id: 'navbar.statistics' }) : ''}
                                        />
                                    )}
                                </Column>
                            </Column>
                        </Box>

                        <Column gap={0.5} mb={3}>
                            <Preload on={() => usePrefetchQuery(getAccountUseCase.handle, [GetAccountUseCase.name])}>
                                <Box sx={{ display: 'flex' }}>
                                    <NavbarButton
                                        collapsed={!expanded}
                                        onClick={openSettingsDialog}
                                        tooltipTitle={!expanded ? formatMessage({ id: 'navbar.settings' }) : ''}
                                    >
                                        <SettingsIcon />
                                        {expanded && <FormattedMessage id='navbar.settings' />}
                                    </NavbarButton>
                                </Box>
                            </Preload>

                            <NavbarLink
                                collapsed={!expanded}
                                icon={<LogoutIcon />}
                                label={formatMessage({ id: 'navbar.logout' })}
                                to='/logout'
                                tooltipTitle={!expanded ? formatMessage({ id: 'navbar.logout' }) : ''}
                            />
                        </Column>
                    </Column>
                )}
            </Drawer>
        </ThemeProvider>
    );
}
