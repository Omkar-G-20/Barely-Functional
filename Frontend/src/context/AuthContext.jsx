import React, { createContext, useState, useEffect } from "react";
import { api, getStoredUser, getToken, setToken, setStoredUser } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initAuth() {
      const storedToken = getToken();
      if (storedToken) {
        setTokenState(storedToken);
        try {
          const res = await api.getMe();
          if (res && res.user) {
            setUser(res.user);
            setStoredUser(res.user);
          }
        } catch (err) {
          setToken(null);
          setStoredUser(null);
          setUser(null);
          setTokenState(null);
        }
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res && res.user) {
      setUser(res.user);
      setTokenState(res.token);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res && res.user) {
      setUser(res.user);
      setTokenState(res.token);
    }
    return res;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setTokenState(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res && res.user) {
        setUser(res.user);
        setStoredUser(res.user);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: token || getToken(),
        setUser,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth } from "./useAuth";
