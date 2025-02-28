// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api',
//   timeout: 5000,  // Set timeout to 5 seconds
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Interceptors for handling token-based authentication
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');  // Assuming token is stored in local storage
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
  
// }, (error) => Promise.reject(error));

// export default axiosInstance;



import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
  timeout: 5000,  // Set timeout to 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors for handling token-based authentication
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  // Assuming token is stored in local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
