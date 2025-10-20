import axios from 'axios';

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
axiosClient.interceptors.request.use(
  async (config) => {
    // Handle token here, for example, add it to headers
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Handle errors here
    return Promise.reject(error);
  }
);

export default axiosClient;

