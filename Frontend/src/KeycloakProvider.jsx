// import React, { createContext, useContext, useEffect, useState } from 'react';
// import Keycloak from 'keycloak-js';

// const KeycloakContext = createContext();

// export const useKeycloak = () => {
//   return useContext(KeycloakContext);
// };

// const keycloak = new Keycloak({
//   realm: 'performance',
//   url: 'http://rahul-ahlawat.io:8080',
//   clientId: 'performclient',
//   clientSecret: 'noAIgO3I9X70qdXZ3a6E5xns1QHoglZ6'
// });

// export { keycloak };

// export const KeycloakProvider = ({ children }) => {
//   const [authenticated, setAuthenticated] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
//     keycloak.init({ onLoad: 'login-required' }).then(auth => {
//       setAuthenticated(auth);
//       if (auth) {
//         keycloak.loadUserInfo().then(info => {
//           setUserInfo(info);
//         }).catch(error => {
//           console.error('Failed to load user info', error);
//         });
//       }
//     }).catch(error => {
//       console.error('Failed to initialize Keycloak', error);
//     });
//   }, []);

//   return (
//     <KeycloakContext.Provider value={{ keycloak, authenticated, userInfo }}>
//       {children}
//     </KeycloakContext.Provider>
//   );
// };


import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from './keycloak';

const KeycloakContext = createContext();

export const useKeycloak = () => {
  return useContext(KeycloakContext);
};

export const KeycloakProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(auth => {
      setAuthenticated(auth);
      if (auth) {
        keycloak.loadUserInfo().then(info => {
          setUserInfo(info);
        }).catch(error => {
          console.error('Failed to load user info', error);
        });
      }
    }).catch(error => {
      console.error('Failed to initialize Keycloak', error);
    });
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, userInfo }}>
      {children}
    </KeycloakContext.Provider>
  );
};
