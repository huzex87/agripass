import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { setAccessToken, clearAccessToken } from "./Status";
import api from "./Api";
import axios from "axios";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const subdomain = sessionStorage.getItem("subdomain");
      if (!subdomain) {
        setUser(null);
        setLoading(false);
        return;
      }
      const response = await axios.post("/disbursify/refresh");
      const newAccessToken = response.data?.accessToken;
      if (!newAccessToken) {
        throw new Error("No access token returned by refresh endpoint");
      }

      setAccessToken(newAccessToken);

      const decodedToken = jwtDecode(newAccessToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        sessionStorage.removeItem("subdomain");
        logout();
        setUser(null);
        setLoading(false);
        return;
      }
      setUser({
        isAuthenticated: true,
        userId: decodedToken.userId,
        subdomain: subdomain,
        role: decodedToken.role,
      });
    } catch (error) {
      clearAccessToken();
      sessionStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (subdomain, password) => {
    try {
      setLoading(true);

      const response = await api.post(
        "/disbursify/login",
        {
          subdomain,
          password,
        },
        { withCredentials: true }
      );
      const {
        accessToken,
        organizationName,
        subdomain: returnedSubdomain,
      } = response.data;

      const decoded = jwtDecode(accessToken);

      setAccessToken(accessToken);
      sessionStorage.setItem("subdomain", returnedSubdomain);

      setUser({
        isAuthenticated: true,
        organizationName,
        subdomain: returnedSubdomain,
        role: decoded.role,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function - updated
  const logout = async () => {
    try {
      const res = await api.post("/disbursify/logout");
      if (res.status === 200) {
        console.log("✅ Logged out successfully:", res.data.message);
      }
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      clearAccessToken(); // Clear from memory
      sessionStorage.clear();
      setUser(null);
      window.location.replace("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
    loading,
    subdomain: user?.subdomain,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
