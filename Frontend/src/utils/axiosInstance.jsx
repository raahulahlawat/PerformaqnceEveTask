import axios from 'axios';
import keycloak from './keycloak';

const axiosInstance = axios.create({
  baseURL: 'http://rahul-ahlawat.io:3001',
  withCredentials: true,
  timeout: 5000, // Timeout of 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
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

// Function to fetch API key from backend
export const fetchApiKey = async () => {
  try {
    const response = await axiosInstance.get('/api/current-api-key'); // Verify this URL is correct
    return response.data.apiKey; // Assuming backend returns { apiKey: 'your-api-key' }
  } catch (error) {
    console.error('Error fetching API key:', error);
    throw error; // Handle error as per your application's needs
  }
};

export default axiosInstance;
