import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL
const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    }
)

axiosInstance.interceptors.response.use(
  (response) => {
      return response;
  },
  (error) => {
      if (error.response && (error.response.status === 404 || error.response.status === 401)) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
      }
      return Promise.reject(error);
  }
);

export default axiosInstance
