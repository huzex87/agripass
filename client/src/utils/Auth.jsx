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
      const mockUserStr = sessionStorage.getItem("mock_user");
      if (!subdomain || !mockUserStr) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(JSON.parse(mockUserStr));
    } catch (error) {
      clearAccessToken();
      sessionStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (subdomain, password) => {
    setLoading(true);
    try {
      const mockUser = {
        isAuthenticated: true,
        organizationName: subdomain.charAt(0).toUpperCase() + subdomain.slice(1) + " Organization",
        subdomain: subdomain,
        role: "organization",
      };

      sessionStorage.setItem("subdomain", subdomain);
      sessionStorage.setItem("mock_user", JSON.stringify(mockUser));

      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function - updated
  const logout = async () => {
    try {
      const res = await api.post("/api/v1/logout");
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
