import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import API from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Load user from token
  const loadUser = () => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser(decoded.user || decoded);
    } catch (err) {
      console.error("Invalid token");
      logout();
    }
  };

  // Register
  const register = async (formData) => {
    try {
      const res = await API.post('/auth/register', formData);

      const newToken = res.data.token;

      localStorage.setItem('token', newToken);
      setToken(newToken);

      loadUser();
      navigate('/');

    } catch (err) {
      throw err.response?.data || { msg: "Registration failed" };
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const res = await API.post('/auth/login', formData);

      const newToken = res.data.token;

      localStorage.setItem('token', newToken);
      setToken(newToken);

      loadUser();
      navigate('/');

    } catch (err) {
      throw err.response?.data || { msg: "Invalid credentials" };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);