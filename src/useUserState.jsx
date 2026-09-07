import { useState } from 'react';
import { getStoredUser, setStoredUser, clearAuth } from './api';

export default function useUserState() {
  const [user, setUserState] = useState(() => getStoredUser());

  const login = (userData) => {
    setUserState(userData);
    setStoredUser(userData);
  };

  const logout = () => {
    setUserState(null);
    clearAuth();
  };

  const updateUser = (updatedUser) => {
    setUserState(updatedUser);
    setStoredUser(updatedUser);
  };

  return {
    user,
    setUser: updateUser,
    isLoggedIn: Boolean(user),
    login,
    logout
  };
}