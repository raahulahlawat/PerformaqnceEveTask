// src/utils/axiosInstance.js

import axios from 'axios';
import keycloak from './keycloak';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // Backend API URL
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async config => {
    if (keycloak.token) {
      await keycloak.updateToken(5); // Refresh the token if it expires within 5 seconds
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
