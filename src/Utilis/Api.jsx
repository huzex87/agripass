import axios from "axios";
import { setAccessToken, getAccessToken, clearAccessToken } from "./Status";
import { toast } from "sonner";
import { get } from "react-hook-form";

const api = axios.create({
  baseURL: "https://disbursify.vercel.app",
  // baseURL: "/",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    const subdomain = sessionStorage.getItem("subdomain");
    const baseDomain = "disbursify.vercel.app";

    if (token) {
      // config.baseURL = `http://${subdomain}.localhost:3001`;
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (subdomain) {
      config.headers["x-subdomain"] = subdomain;
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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (
        originalRequest._retry ||
        originalRequest.url?.includes("/disbursify/refresh") ||
        originalRequest.url?.includes("/disbursify/login")
      ) {
        clearAccessToken();
        sessionStorage.clear();
        toast.error("Session expired. Please login again.");
        window.location.replace("/login");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          "https://disbursify.vercel.app/disbursify/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              "x-subdomain": sessionStorage.getItem("subdomain"),
            },
          }
        );
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (error) {
        processQueue(error, null);
        clearAccessToken();
        sessionStorage.clear();
        toast.error("Session expired. Please login again.");
        window.location.replace("/login");
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    // Handle 403 (forbidden) - could also be token expiration depending on your backend
    if (error.response?.status === 403) {
      // You can handle 403 the same way as 401 if your backend sends 403 for expired tokens
      // For now, I'll leave it as is, but you can duplicate the 401 logic here if needed
    }
    return Promise.reject(error);
  }
);

export default api;
