import React from "react";
import { useLocation, Navigate, useParams, Outlet } from "react-router-dom";
import { useAuthentication } from "./Auth";

const ProtectedOrgRoute = () => {
  const { subdomain } = useParams();
  const { isAuthenticated, user } = useAuthentication();
  const location = useLocation();

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
