import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ added

  const login = (user, authToken) => {
    setUserData(user);
    setToken(authToken);
    setIsAuthenticated(true);

    localStorage.setItem("token", authToken);
    localStorage.setItem("userData", JSON.stringify(user));
  };

  const logout = () => {
    setUserData(null);
    setToken(null);
    setIsAuthenticated(false);

    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUserData(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      setToken(null);
      setUserData(null);
      setIsAuthenticated(false);
    }

    setLoading(false); // ✅ auth check finished
  }, []);

  return (
    <AuthContext.Provider
      value={{ userData, token, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
