import React, { ReactElement, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'presentation/hooks';

export default function LogoutPage(): ReactElement {
    const { logout } = useAuth();

    useEffect((): void => {
        logout();
    }, []);

    return <Navigate replace to='/login' />;
}
