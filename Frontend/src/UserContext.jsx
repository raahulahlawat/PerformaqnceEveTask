import React, { createContext, useContext, useEffect, useState } from 'react';
import { keycloak } from './App'; // Adjust the import path as necessary

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (keycloak.authenticated) {
      keycloak.loadUserInfo().then(userInfo => {
        setUserInfo(userInfo);
      }).catch(error => {
        console.error('Error loading user info:', error);
      });
    }
  }, []);

  return (
    <UserContext.Provider value={userInfo}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfo = () => useContext(UserContext);
