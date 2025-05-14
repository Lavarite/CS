import React, {ReactNode, useContext} from 'react';
import { Navigate } from 'react-router-dom';
import {AuthContext} from './AuthContext';
import {ForbiddenPage} from "../ErrorPages";

type RoleGuardProps = {
    allowedRoles: string[];
    fallback?: React.ReactNode;
    redirectTo?: string;
    children: ReactNode;
};

export const RoleRouteGuard: React.FC<RoleGuardProps> = ({allowedRoles, children, fallback = <ForbiddenPage />,redirectTo = '/login'}) => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Loading…</div>;
    }

    if (!user) {
        // Not logged in
        return <Navigate to={redirectTo} replace />;
    }

    const hasAccess = allowedRoles.includes(user.role);
    return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export const RoleElementGuard: React.FC<RoleGuardProps> = ({allowedRoles, children, fallback = null,redirectTo = '/login'}) => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Loading…</div>;
    }

    if (!user) {
        // Not logged in
        return <Navigate to={redirectTo} replace />;
    }

    const hasAccess = allowedRoles.includes(user.role);
    return hasAccess ? <>{children}</> : <>{fallback}</>;
};