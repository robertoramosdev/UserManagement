import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, restore the session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ user, token }) => {
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  };

  // endpoint is one of: /auth/login, /auth/signup, /auth/admin/login, /auth/admin/signup
  const authenticate = async (endpoint, payload) => {
    const res = await api.post(endpoint, payload);
    return handleAuth(res.data);
  };

  // Update the current user's own profile and sync it into context
  const updateProfile = async (payload) => {
    const res = await api.put(`/users/${user.id}`, payload);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, authenticate, updateProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
