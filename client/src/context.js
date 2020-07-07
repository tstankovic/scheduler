import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

import axios from './axios';

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      const token = localStorage.getItem('jwt');
      setIsAuth(true);
      const decoded = jwt_decode(token);
      setUser(decoded);
      setUserLoaded(true);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
      setUserLoaded(true);
      if (
        window.location.pathname === '/login' ||
        window.location.pathname === '/register'
      )
        return;
      window.location.href = '/login';
    }
  }, []);

  const login = (token) => {
    const decoded = jwt_decode(token);
    setUser(decoded);
    setIsAuth(true);
    setUserLoaded(true);
    localStorage.setItem('jwt', token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  };

  const logout = () => {
    setUser({});
    setIsAuth(false);
    setUserLoaded(true);
    localStorage.removeItem('jwt');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, userLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
