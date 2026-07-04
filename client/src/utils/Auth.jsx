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

  const login = async (subdomainOrEmail, password, isBeneficiary = false) => {
    setLoading(true);
    try {
      if (isBeneficiary) {
        const res = await api.post("/api/v1/beneficiary/login", {
          email: subdomainOrEmail,
          password
        });
        if (res.data?.token) {
          setAccessToken(res.data.token);
          const mockUser = {
            isAuthenticated: true,
            email: subdomainOrEmail,
            role: "beneficiary",
          };
          sessionStorage.setItem("subdomain", "beneficiary");
          sessionStorage.setItem("mock_user", JSON.stringify(mockUser));
          setUser(mockUser);
          return { success: true, role: "beneficiary" };
        }
      } else {
        const isEmail = subdomainOrEmail.includes("@");
        const payload = isEmail ? { email: subdomainOrEmail, password } : { subdomain: subdomainOrEmail, password };

        const res = await api.post("/api/v1/login", payload);
        if (res.data?.message === "Login successful") {
          const resolvedSubdomain = res.data.subdomain;
          setAccessToken(res.data.accessToken);

          const mockUser = {
            isAuthenticated: true,
            organizationName: res.data.organizationName,
            subdomain: resolvedSubdomain,
            role: "organization",
          };

          sessionStorage.setItem("subdomain", resolvedSubdomain);
          sessionStorage.setItem("mock_user", JSON.stringify(mockUser));

          setUser(mockUser);
          return { success: true, subdomain: resolvedSubdomain, role: "organization" };
        }
      }
      return { success: false, error: "Authentication failed" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed. Please check your credentials.",
      };
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/v1/admin/login", { email, password });
      if (res.data?.token) {
        setAccessToken(res.data.token);
        const mockUser = {
          isAuthenticated: true,
          email,
          adminName: res.data.adminName,
          role: "admin",
        };
        sessionStorage.setItem("subdomain", "admin");
        sessionStorage.setItem("mock_user", JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true, role: "admin" };
      }
      return { success: false, error: "Authentication failed" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed. Please check your credentials.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function - updated
  const logout = async () => {
    const loginPath = sessionStorage.getItem("subdomain") === "beneficiary" ? "/login/beneficiary" : "/signin";
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
      window.location.replace(loginPath);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    login,
    loginAdmin,
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
