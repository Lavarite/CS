import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export function RequireAuth() {
    const { isLoading, isAuthenticated, token } = useContext(AuthContext);
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        console.log(token);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}
