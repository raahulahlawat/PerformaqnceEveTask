// import React, { createContext, useContext, useState, useEffect } from 'react';
// import Keycloak from 'keycloak-js';

// const KeycloakContext = createContext();

// export const KeycloakProvider = ({ children }) => {
//     const [keycloak, setKeycloak] = useState(null);
//     const [authenticated, setAuthenticated] = useState(false);
//     const [token, setToken] = useState(null);

//     useEffect(() => {
//         const keycloakInstance = Keycloak({
//             realm: 'performance',
//             url: 'http://rahul-ahlawat.io:8080',
//             clientId: 'performclient'
//         });

//         keycloakInstance.init({ onLoad: 'login-required' })
//             .then(authenticated => {
//                 setKeycloak(keycloakInstance);
//                 setAuthenticated(authenticated);
//                 console.log('User is authenticated:', authenticated);
//                 if (authenticated) {
//                     keycloakInstance
//                         .updateToken(5) // Refresh token every 5 seconds
//                         .then(refreshed => {
//                             if (refreshed) {
//                                 setToken(keycloakInstance.token);
//                                 console.log('Token refreshed:', keycloakInstance.token);
//                             }
//                         })
//                         .catch(error => {
//                             console.error('Token refresh error:', error);
//                         });
//                 }
//             })
//             .catch(error => {
//                 console.error('Authentication error:', error);
//             });

//         return () => {
//             if (keycloakInstance) {
//                 keycloakInstance.logout();
//             }
//         };
//     }, []);

//     return (
//         <KeycloakContext.Provider value={{ keycloak, authenticated, token }}>
//             {children}
//         </KeycloakContext.Provider>
//     );
// };

// export const useKeycloak = () => useContext(KeycloakContext);

import React, { createContext, useContext } from 'react';

export const KeycloakContext = createContext(null);

export const KeycloakProvider = ({ children, value }) => {
    return (
        <KeycloakContext.Provider value={value}>
            {children}
        </KeycloakContext.Provider>
    );
};

export const useKeycloak = () => useContext(KeycloakContext);
