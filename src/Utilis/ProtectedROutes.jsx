import React from "react";
import { useLocation, Navigate, useParams, Outlet } from "react-router-dom";
import { useAuthentication } from "./Auth";
import { Loader2 } from "lucide-react";

const ProtectedOrgRoute = () => {
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Verify the user is accessing their correct subdomain
  if (user?.subdomain && user.subdomain !== subdomain) {
    return <Navigate to={`/${user.subdomain}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedOrgRoute;
