
// import Keycloak from 'keycloak-js';

// const keycloak = new Keycloak({
//   url: 'http://rahul-ahlawat.io:8080/auth',
//   realm: 'performance',
//   clientId: 'performclient',
// });

// keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
//   if (!authenticated) {
//     window.location.reload();
//   } else {
//     console.info('Authenticated');
//   }
// }).catch(error => {
//   console.error('Authentication failed', error);
// });

// export default keycloak;


// import Keycloak from 'keycloak-js';

// const keycloak = new Keycloak({
//   url: 'http://rahul-ahlawat.io:8080/auth',  // Ensure the URL includes the '/auth' path
//   realm: 'performance',
//   clientId: 'performclient'
// });

// const initKeycloak = (onAuthenticatedCallback) => {
//   keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
//     if (authenticated) {
//       onAuthenticatedCallback();
//     } else {
//       console.warn('User is not authenticated');
//       keycloak.login();
//     }
//   }).catch(error => {
//     console.error('Keycloak initialization failed', error);
//   });
// };

// const doLogout = () => keycloak.logout();

// const getToken = () => keycloak.token;

// const isLoggedIn = () => !!keycloak.token;

// const updateToken = (successCallback) => {
//   keycloak.updateToken(5).then(successCallback).catch(() => keycloak.login());
// };

// export {
//   keycloak,
//   initKeycloak,
//   doLogout,
//   getToken,
//   isLoggedIn,
//   updateToken
// };


import Keycloak from 'keycloak-js';

const keycloakConfig = {
  realm: 'performance',
  url: 'http://rahul-ahlawat.io:8080/auth', // Replace with your Keycloak server URL
  clientId: 'performclient',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
