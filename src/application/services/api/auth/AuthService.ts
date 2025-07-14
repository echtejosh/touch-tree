import { AuthServiceContract } from 'domain/contracts/services/AuthServiceContract';
import { ApiService, CookieService } from 'infrastructure/services';
import Container from 'infrastructure/services/Container';
import endpoints from 'infrastructure/routes/endpoints';
import { LoginModel } from 'domain/models/auth/LoginModel';
import { ApiResponse } from 'infrastructure/services/types';

interface LoginResponse extends ApiResponse {
    token: string | null;
    listingMultipleRelations: Array<{
        id: number;
        departmentId: number;
        fullCompanyName: string;
        city: string;
    }> | null;
}

/**
 * AuthService provides methods for handling user authentication.
 *
 * @constructor
 */
export default function AuthService(): AuthServiceContract {
    const apiService = Container.resolve(ApiService);
    const cookieService = Container.resolve(CookieService);

    const expiresInDays = 4 / 24; /* expires in 4 hours */
    const inactivityThreshold = 15 * 60 * 1000; // 15 minutes delay to reset cookie
    let lastResetTime = Date.now();

    /**
     * Retrieves the current authentication token from local storage.
     *
     * @returns The authentication token, or `null` if no token is found.
     */
    function getToken(): string | null {
        return cookieService.getItem('token') || null;
    }

    /**
     * Logs in a user by sending credentials to the server and storing the token if successful.
     *
     * @param database The name of the database to authenticate against.
     * @param email The user's email address for login.
     * @param password The user's password for login.
     * @param relationId The user's site id for login.
     *
     * @returns A promise that resolves to the authentication token if successful, or `null` if login fails.
     */
    async function login(
        database: string,
        email: string,
        password: string,
        relationId?: number,
    ): Promise<LoginModel | null> {
        const {
            token,
            listingMultipleRelations,
        } = await apiService.request(endpoints.login)
            .send<LoginResponse>({
                databaseName: database,
                email,
                password,
                relationId,
            });

        if (token) {
            cookieService.setItem('token', token, { expires: expiresInDays }); /* expires in 4 hours */

            return {
                token,
                requiresRelationId: false,
            };
        }

        if (!token && listingMultipleRelations) {
            return {
                token: null,
                requiresRelationId: true,
            };
        }

        return null;
    }

    /**
     * Logs out the user by removing the authentication token from local storage.
     */
    function logout(): void {
        cookieService.removeItem('token');
    }

    /**
     * Sends a password reset request to the server for the specified user.
     *
     * @param database The name of the database where the user's account resides.
     * @param email The user's email address to send the password reset instructions.
     *
     * @returns A promise that resolves once the request has been sent successfully.
     */
    async function resetPassword(database: string, email: string): Promise<void> {
        await apiService.request(endpoints.resetPassword)
            .send({
                database,
                email,
            });
    }

    /**
     * Reset the inactivity cookie if the time threshold has passed since the last reset.
     */
    function resetInactivityCookie(): void {
        const currentTime = Date.now();

        // Check if the inactivity period has passed (15 minutes)
        if (currentTime - lastResetTime >= inactivityThreshold) {
            const currentValue = cookieService.getItem('token') as string;

            cookieService.setItem('token', currentValue, { expires: expiresInDays });
            lastResetTime = currentTime;
        }
    }

    /**
     *
     */
    function setupInactivityTracking(): void {
        ['mousemove', 'keydown', 'scroll', 'click'].forEach((event) => document.addEventListener(event, resetInactivityCookie));
    }

    return {
        getToken,
        login,
        logout,
        resetPassword,
        resetInactivityCookie,
        setupInactivityTracking,
    };
}
