import axios from 'axios';
import keycloak from './keycloak';

const axiosInstance = axios.create({
  baseURL: 'http://rahul-ahlawat.io:3001',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async config => {
    if (keycloak.token) {
      await keycloak.updateToken(5);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
