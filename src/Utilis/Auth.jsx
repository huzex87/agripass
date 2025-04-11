import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          logout();
          setUser(null);
          return;
        }
        setUser({
          isAuthenticated: true,
          userId: decodedToken.userId,
          email: decodedToken.email,
        });
      } catch (error) {
        localStorage.removeItem("token");
        logout();
        setUser(null);
        return;
      }
    } else {
      setUser(null);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/beneficiarylogin");
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
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
