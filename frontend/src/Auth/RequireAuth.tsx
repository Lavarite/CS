import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export function RequireAuth() {
    const { token } = useContext(AuthContext);
    const location = useLocation();

    console.log('RequireAuth > token is:', token);
    if (!token) {
        console.log('RequireAuth > redirecting to /login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('RequireAuth > rendering children');
    return <Outlet />;
}
