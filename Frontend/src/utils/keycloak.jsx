
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'performance',
  clientId: 'performclient',
});

keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
  if (!authenticated) {
    window.location.reload();
  } else {
    console.info('Authenticated');
  }
}).catch(error => {
  console.error('Authentication failed', error);
});

export default keycloak;
