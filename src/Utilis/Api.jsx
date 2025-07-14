import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const subdomain = localStorage.getItem("subdomain");
    const baseDomain = "localhost:3001";

    if (token && subdomain) {
      config.baseURL = `http://${subdomain}.${baseDomain}`;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("subdomain");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
