import { Suspense, lazy, ComponentType, ReactElement } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { LoginLayout, Layout, RelativeLayout } from 'presentation/layouts';
import ErrorPage from 'presentation/pages/ErrorPage';
import RequireAuth from 'presentation/components/RequireAuth';
import { getCurrentTheme } from 'presentation/themes/themeSelect';
import LayoutWithPlatform from 'presentation/layouts/LayoutWithPlatform';

// Direct imports for editor components (no lazy loading)
import EditorTabs from 'presentation/pages/newsstand/editor/EditorTabs';
import EditorColorsTab from 'presentation/pages/newsstand/editor/tabs/EditorColorsTab';
import EditorLogoTab from 'presentation/pages/newsstand/editor/tabs/EditorLogoTab';
import EditorSidebarTab from 'presentation/pages/newsstand/editor/tabs/EditorSidebarTab';
import EditorWebsiteTab from 'presentation/pages/newsstand/editor/tabs/EditorWebsiteTab';
import EditorPodsTab from 'presentation/pages/newsstand/editor/tabs/EditorPodsTab';
import EditorBannersTab from 'presentation/pages/newsstand/editor/tabs/EditorBannersTab';

// Loading component
const PageLoader = (): ReactElement => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
    }}
    >
        Loading...
    </div>
);

// Lazy load all other page components (keeping lazy loading for non-editor components)
const LoginPage = lazy(() => import('presentation/pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('presentation/pages/auth/ForgotPasswordPage'));
const LogoutPage = lazy(() => import('presentation/pages/auth/LogoutPage'));
const CampaignsPage = lazy(() => import('presentation/pages/CampaignsPage'));
const HighlightsPage = lazy(() => import('presentation/pages/HighlightsPage'));
const NewsstandEditorPage = lazy(() => import('presentation/pages/newsstand/NewsstandEditorPage'));
const NewsstandSupplementsPage = lazy(() => import('presentation/pages/newsstand/NewsstandSupplementsPage'));
const NewsstandSettingsPage = lazy(() => import('presentation/pages/newsstand/NewsstandSettingsPage'));
const NewsstandPublicationsPage = lazy(() => import('presentation/pages/newsstand/NewsstandPublicationsPage'));
const StatisticsPage = lazy(() => import('presentation/pages/StatisticsPage'));
const DashboardPage = lazy(() => import('presentation/pages/dashboard/DashboardPage'));
const MediaPage = lazy(() => import('presentation/pages/MediaPage'));
const RelationAdvertsPage = lazy(() => import('presentation/pages/RelationAdvertsPage'));
const AdvertsPage = lazy(() => import('presentation/pages/AdvertsPage'));

const withSuspense = (Component: ComponentType): ReactElement => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

function createBrowser(): ReturnType<typeof createBrowserRouter> {
    const theme = getCurrentTheme();

    const platformEditorChildren: RouteObject[] = [
        {
            index: true,
            element: <EditorTabs />,
        },
        {
            path: 'colors',
            element: <EditorColorsTab />,
        },
        {
            path: 'pods',
            element: <EditorPodsTab />,
        },
        {
            path: 'logo',
            element: <EditorLogoTab />,
        },
        {
            path: 'sidebar',
            element: <EditorSidebarTab />,
        },
        {
            path: 'browser',
            element: <EditorWebsiteTab />,
        },
    ];

    if (theme.subset) {
        platformEditorChildren.push({
            path: 'banners',
            element: <EditorBannersTab />,
        });
    }

    const routes: RouteObject[] = [
        {
            element: <RelativeLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    element: <RequireAuth />,
                    children: [
                        {
                            path: '/newsstand/editor',
                            element: withSuspense(NewsstandEditorPage),
                            children: platformEditorChildren,
                        },
                    ],
                },
            ],
        },
        {
            path: '/',
            element: <Navigate to='/login' />,
            errorElement: <ErrorPage />,
        },
        {
            element: <LoginLayout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '/login',
                    element: <LoginPage />,
                },
                {
                    path: '/forgot-password',
                    element: withSuspense(ForgotPasswordPage),
                },
            ],
        },
    ];

    if (!theme.subset) {
        routes.push({
            element: <LayoutWithPlatform />,
            errorElement: <ErrorPage />,
            children: [{
                element: <RequireAuth />,
                children: [
                    {
                        path: '/dashboard',
                        element: withSuspense(DashboardPage),
                    },
                ],
            }],
        });
    }

    const routes2: RouteObject[] = [
        {
            path: '/newsstand',
            element: withSuspense(NewsstandSettingsPage),
        },
        {
            path: '/newsstand/supplements',
            element: withSuspense(NewsstandSupplementsPage),
        },
        {
            path: '/media',
            element: withSuspense(MediaPage),
        },
        {
            path: '/relation-adverts',
            element: withSuspense(RelationAdvertsPage),
        },
        {
            path: '/adverts',
            element: withSuspense(AdvertsPage),
        },
        {
            path: '/highlights',
            element: withSuspense(HighlightsPage),
        },
        {
            path: '/statistics',
            element: withSuspense(StatisticsPage),
        },
    ];

    if (!theme.subset) {
        routes2.push(
            {
                path: '/campaigns',
                element: withSuspense(CampaignsPage),
            },
            {
                path: '/newsstand/publications',
                element: withSuspense(NewsstandPublicationsPage),
            },
        );
    }

    routes.push({
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <RequireAuth />,
                children: routes2,
            },
            {
                path: '/logout',
                element: withSuspense(LogoutPage),
            },
        ],
    });

    return createBrowserRouter(routes, {
        basename: import.meta.env.VITE_BASE_PATH,
    });
}

export default createBrowser();
