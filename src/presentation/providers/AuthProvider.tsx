import React, { createContext, PropsWithChildren, ReactElement, useMemo, useState } from 'react';
import Container from 'infrastructure/services/Container';
import { LogoutUseCase } from 'application/usecases/auth/LogoutUseCase';
import { LoginUseCase, LoginUseCaseProps } from 'application/usecases/auth/LoginUseCase';
import AuthService from 'application/services/api/auth/AuthService';
import { LoginModel } from 'domain/models/auth/LoginModel';

/**
 * Authentication context for the useAuth hook.
 */
export type AuthContextType = {
    /**
     * Indicates whether a user is currently authenticated.
     *
     * This boolean value is `true` if there is an active user session and
     * the user is logged in; otherwise, it is `false`.
     */
    loggedIn: boolean,

    /**
     *
     */
    token: string | null,

    /**
     * Authenticates a user and initiates a session.
     *
     * @param props
     */
    login(props: LoginUseCaseProps): Promise<LoginModel | null>;

    /**
     * Terminates the current user session.
     */
    logout(): void;
};

/**
 * Creates an Authentication context.
 */
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication Provider.
 *
 * @constructor
 */
export default function AuthProvider({ children }: PropsWithChildren): ReactElement {
    const authService = Container.resolve(AuthService);
    const logoutUseCase = Container.resolve(LogoutUseCase);
    const loginUseCase = Container.resolve(LoginUseCase);

    const [_token, _setToken] = useState<string | null>(authService.getToken());

    /**
     * Authenticates a user and initiates a session.
     *
     * @param props
     */
    async function login(props: LoginUseCaseProps): Promise<LoginModel | null> {
        const response = await loginUseCase.handle(props);

        if (response?.token) {
            _setToken(response.token);
        }

        return response;
    }

    /**
     * Terminates the current user session.
     */
    function logout(): void {
        _setToken(null);

        logoutUseCase.handle();
    }

    /**
     * The properties to provide to the provider.
     */
    const value = useMemo(
        (): AuthContextType => ({
            token: _token,
            login,
            logout,
            loggedIn: Boolean(_token),
        }),
        [_token, login, logout],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
