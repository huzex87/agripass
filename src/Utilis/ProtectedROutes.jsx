import React from "react";
import { useLocation, Navigate, useParams } from "react-router-dom";
import { useAuthentication } from "./Auth";
import { Backdrop, CircularProgress } from "@mui/material";

const ProtectedOrgRoute = ({ children }) => {
  const { subdomain } = useParams();
  const { isAuthenticated, loading, user } = useAuthentication();
  const location = useLocation();

  // Render loading state
  if (loading) {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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

  // Render children if authenticated and subdomain matches
  return children;
};

export default ProtectedOrgRoute;
