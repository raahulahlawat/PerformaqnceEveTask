import React from 'react';
import keycloak from '../utils/keycloak.jsx'; 

const Protected = () => {
  const logout = () => {
    keycloak.logout();
  };

  return (
    <div>
      <h2>Protected Page</h2>
      <p>Welcome, {keycloak.tokenParsed.preferred_username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Protected;
