import axios from "axios";
import { setAccessToken, getAccessToken, clearAccessToken } from "./Status";
import { toast } from "sonner";

// In production this MUST be the HTTPS URL of the deployed backend
// (e.g. https://<your-server>.vercel.app). If it is missing, requests fall
// back to same-origin "/", which on the static client deployment resolves to
// the SPA itself and silently breaks login and every other API call.
const API_BASE_URL = import.meta.env.VITE_API_URL || "/";

if (!import.meta.env.VITE_API_URL) {
  // Surfaced in the browser console to make a missing config obvious rather
  // than presenting it as an "invalid credentials" failure to the user.
  console.warn(
    "[AgriPass] VITE_API_URL is not set — API requests default to same-origin '/', which will fail against the deployed backend."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
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
        originalRequest.url?.includes("/api/v1/refresh") ||
        originalRequest.url?.includes("/api/v1/login")
      ) {
        const loginPath = sessionStorage.getItem("subdomain") === "beneficiary" ? "/login/beneficiary" : "/signin";
        clearAccessToken();
        sessionStorage.clear();
        toast.error("Session expired. Please login again.");
        window.location.replace(loginPath);
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
        // Use the configured axios instance so the refresh request honors
        // VITE_API_URL / API_BASE_URL instead of always hitting same-origin.
        const response = await axios.post(
          `${API_BASE_URL.replace(/\/$/, "")}/api/v1/refresh`,
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
        const loginPath = sessionStorage.getItem("subdomain") === "beneficiary" ? "/login/beneficiary" : "/signin";
        processQueue(error, null);
        clearAccessToken();
        sessionStorage.clear();
        toast.error("Session expired. Please login again.");
        window.location.replace(loginPath);
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
