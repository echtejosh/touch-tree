type RoutePreloader = () => Promise<unknown>;

const ROUTE_PRELOADERS: Record<string, RoutePreloader> = {
    '/login': () => import('presentation/pages/auth/LoginPage'),
    '/forgot-password': () => import('presentation/pages/auth/ForgotPasswordPage'),
    '/logout': () => import('presentation/pages/auth/LogoutPage'),
    '/dashboard': () => import('presentation/pages/dashboard/DashboardPage'),
    '/campaigns': () => import('presentation/pages/CampaignsPage'),
    '/highlights': () => import('presentation/pages/HighlightsPage'),
    '/newsstand': () => import('presentation/pages/newsstand/NewsstandSettingsPage'),
    '/newsstand/editor': () => import('presentation/pages/newsstand/NewsstandEditorPage'),
    '/newsstand/supplements': () => import('presentation/pages/newsstand/NewsstandSupplementsPage'),
    '/newsstand/publications': () => import('presentation/pages/newsstand/NewsstandPublicationsPage'),
    '/statistics': () => import('presentation/pages/StatisticsPage'),
    '/media': () => import('presentation/pages/MediaPage'),
    '/relation-adverts': () => import('presentation/pages/RelationAdvertsPage'),
    '/adverts': () => import('presentation/pages/AdvertsPage'),
};

const preloadedRoutes = new Set<string>();

export function preloadRoute(path: string): void {
    if (!preloadedRoutes.has(path) && ROUTE_PRELOADERS[path]) {
        ROUTE_PRELOADERS[path]().then(() => {
            preloadedRoutes.add(path);
        });
    }
}
