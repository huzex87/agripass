import axios from "axios";

const api = axios.create({
  baseURL: "https://disbursify.vercel.app",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const subdomain = localStorage.getItem("subdomain");
    const baseDomain = "disbursify.vercel.app";

    if (token) {
      config.baseURL = `https://${baseDomain}`;
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (subdomain) {
      config.headers["x-subdomain"] = subdomain;
    }
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
    }
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
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
