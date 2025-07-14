import { LoginModel } from 'domain/models/auth/LoginModel';

/**
 * Contract defining the methods for authentication services.
 */
export interface AuthServiceContract {
    /**
     * Retrieves the current authentication token from local storage.
     *
     * @returns The authentication token, or `null` if no token is found.
     */
    getToken(): string | null;

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
    login(database: string, email: string, password: string, relationId?: number): Promise<LoginModel | null>;

    /**
     * Logs out the user by removing the authentication token from local storage.
     */
    logout(): void;

    /**
     * Sends a password reset request to the server for the specified user.
     *
     * @param database The name of the database where the user's account resides.
     * @param email The user's email address to send the password reset instructions.
     *
     * @returns A promise that resolves once the request has been sent successfully.
     */
    resetPassword(database: string, email: string): Promise<void>;

    /**
     * Reset the inactivity cookie if the time threshold has passed since the last reset.
     */
    resetInactivityCookie(): void;

    /**
     * Sets up inactivity tracking for user sessions.
     */
    setupInactivityTracking(): void;
}
