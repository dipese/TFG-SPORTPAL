/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../../api' // Asegúrate de importar correctamente la clase API

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await API.instance().login(credentials.email, credentials.password);
      if (result) {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        setUser(userInfo);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    return false;
  };

  const register = async (credentials) => {
    setLoading(true);
    try {
      const result = await API.instance().createUser(credentials);
      if (result) {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        setUser(userInfo);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register,loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };