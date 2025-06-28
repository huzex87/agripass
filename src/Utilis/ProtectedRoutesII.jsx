import React from "react";
import { useAuthentication } from "../Utilis/Auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoutesII = () => {
  const { isAuthenticated, user, loading } = useAuthentication();
  const location = useLocation();
  const allowedRoles = ["beneficiary", "admin"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <Loader2 className="animate-spin text-blue-500" size={24} />
        <p>Checking for Authentication</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login/beneficiary" state={{ from: location }} replace />
    );
  }

  if (user?.role && !allowedRoles.includes(user.role)) {
    if (user?.role === "organization") {
      return <Navigate to={`/${user.subdomain}/dashboard`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutesII;
