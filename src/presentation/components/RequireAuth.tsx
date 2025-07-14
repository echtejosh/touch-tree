import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'presentation/hooks';

export default function RequireAuth() {
    const { loggedIn } = useAuth();
    const location = useLocation();

    if (!loggedIn) {
        return <Navigate replace state={{ from: location }} to='/login' />;
    }

    return <Outlet />;
}
