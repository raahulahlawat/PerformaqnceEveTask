import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    realm: 'performance',
    url: 'http://rahul-ahlawat.io:8080',
    clientId: 'performclient'
});

export const initKeycloak = () => {
    return new Promise((resolve, reject) => {
      keycloak
        .init({ onLoad: 'check-sso' })
        .then((authenticated) => {
          resolve(authenticated);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return keycloak.authenticated;
  };
  
  // Retrieve token
  export const getToken = () => {
    return keycloak.token;
  };
  
  // Login
  export const login = () => {
    keycloak.login();
  };
  
  // Logout
  export const logout = () => {
    keycloak.logout();
  };
  
  export default keycloak;


