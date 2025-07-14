import { useContext } from 'react';
import { AuthContext, AuthContextType } from 'presentation/providers/AuthProvider';

/**
 * A hook to access the authentication information about the current user session
 * and methods for user authentication and session management.
 *
 * @returns The current authentication context value, which includes session details and authentication methods.
 */
export default function useAuth(): AuthContextType {
    return <AuthContextType>useContext(AuthContext);
}
