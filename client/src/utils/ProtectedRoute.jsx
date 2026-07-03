import React from "react";
import { useLocation, Navigate, useParams, Outlet } from "react-router-dom";
import { useAuthentication } from "./Auth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ allowedRoles = [], requireSubdomain = false, redirectPath }) => {
  const { subdomain } = useParams();
  const { isAuthenticated, user, loading } = useAuthentication();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader2 className="animate-spin text-blue-500" size={24} />
        <p>Checking for Authentication</p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    const defaultRedirect = requireSubdomain ? "/signin" : "/login/beneficiary";
    return <Navigate to={redirectPath || defaultRedirect} state={{ from: location }} replace />;
  }

  // Verify subdomain if required
  if (requireSubdomain && user?.subdomain && user.subdomain !== subdomain) {
    return <Navigate to={`/${user.subdomain}/dashboard`} replace />;
  }

  // Verify roles if specified
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    if (user?.role === "organization") {
      return <Navigate to={`/${user.subdomain}/dashboard`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
