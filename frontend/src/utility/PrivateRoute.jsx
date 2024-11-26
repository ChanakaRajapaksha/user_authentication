import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = ({ allowedRoles }) => {
    const { auth } = useAuth();

    console.log("Auth roles:", auth?.roles); // Debugging roles
    console.log("Allowed roles:", allowedRoles);

    // Check if the user has at least one allowed role
    const hasAccess = allowedRoles.some((role) => auth?.roles?.includes(role));

    if (!auth.roles || !auth.roles.length) {
        console.warn("Unauthorized access: No roles found in auth state.");
    }

    return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
