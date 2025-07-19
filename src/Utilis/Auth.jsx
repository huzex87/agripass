import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const subdomain = localStorage.getItem("subdomain");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("subdomain");
          logout();
          setUser(null);
          setLoading(false);
          return;
        }
        setUser({
          isAuthenticated: true,
          userId: decodedToken.userId,
          email: decodedToken.email,
          subdomain: subdomain,
          role: decodedToken.role,
        });
        setLoading(false);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("subdomain");
        logout();
        setUser(null);
        setLoading(false);
        return;
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  };

  const login = (token, subdomain) => {
    localStorage.setItem("token", token);
    if (subdomain) {
      localStorage.setItem("subdomain", subdomain);
    }
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("subdomain");
    localStorage.removeItem("theme");
    setUser(null);
    window.location.reload();
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
