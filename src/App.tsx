import Container from 'infrastructure/services/Container';
import 'presentation/fonts';
import 'presentation/locale';
import router from 'presentation/router';
import React, { ReactElement, useEffect } from 'react';
import { AuthProvider, IntlProvider } from 'presentation/providers';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { mainTheme } from 'presentation/theme';
import { ApiService } from 'infrastructure/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthMiddleware } from 'infrastructure/middleware';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import TooltipProvider from 'presentation/providers/TooltipProvider';
import { DialogProvider } from 'presentation/providers/DialogProvider';
import { useAuth } from 'presentation/hooks';
import { getCurrentTheme } from 'presentation/themes/themeSelect';
import { useFavicon } from 'presentation/hooks/useFavicon';
import { getDomainWithoutSuffix } from 'tldts';
import AuthService from 'application/services/api/auth/AuthService';
import { NavbarExpansionProvider } from 'presentation/providers/NavbarExpansionProvider';

const apiService = Container.resolve(ApiService);

apiService.middleware([
    Container.resolve(AuthMiddleware).handle,
]);

/**
 * Register providers.
 *
 * @constructor
 */
function Providers(): ReactElement {
    const queryClient = Container.resolve(QueryClient);
    const authService = Container.resolve(AuthService);

    const { logout } = useAuth();

    const theme = getCurrentTheme();

    useFavicon(theme?.favicon);

    const domain = getDomainWithoutSuffix(window.location.href);

    /**
     * Add API event listeners here:
     */

    apiService.on(401, (): void => logout());

    useEffect(() => {
        if (domain) {
            document.title = domain;
        } else {
            document.title = 'TouchTree';
        }
    }, [domain]);

    useEffect(() => {
        authService.setupInactivityTracking();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <IntlProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <ThemeProvider theme={mainTheme}>
                            <DialogProvider>
                                <NavbarExpansionProvider>
                                    <RouterProvider router={router} />
                                </NavbarExpansionProvider>
                            </DialogProvider>
                        </ThemeProvider>
                    </LocalizationProvider>
                </IntlProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
}

/**
 *
 * @constructor
 */
export default function App(): ReactElement {
    return (
        <AuthProvider>
            <Providers />
        </AuthProvider>
    );
}
