import axios from "axios";

// Make an 'instance' of axios
const axiosHttp = axios.create({
  // where we make our configurations
  baseURL: process.env.API_URL,
});

axiosHttp.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${process.env.TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add configure interceptors && all the other cool stuff
axiosHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 404) return Promise.reject(error);

    if (error.response.status === 500) return Promise.reject(error);

    if (error.response.status === 503) return Promise.reject(error);

    return Promise.reject(error);
  }
);

export default axiosHttp;
