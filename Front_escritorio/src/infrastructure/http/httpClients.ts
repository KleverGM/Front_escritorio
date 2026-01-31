
import axios from "axios";
import { tokenStorage } from "../storage/tokenStorage";

// Forzar uso de la URL del API definida en VITE_API_URL (nube).
const API_URL = import.meta.env.VITE_API_URL as string | undefined;

if (!API_URL) {
  console.warn('VITE_API_URL no está definido. Define VITE_API_URL apuntando a la API en la nube.');
}

const baseURL = API_URL ? `${API_URL}/api` : '';

export const publicHttp = axios.create({
  baseURL,
});

export const authHttp = axios.create({
  baseURL,
});

authHttp.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If sending FormData, let the browser set the Content-Type (boundary)
  if (config.data instanceof FormData) {
    if (config.headers) {
      // Remove any Content-Type so axios/browser set multipart boundary
      delete (config.headers as any)["Content-Type"];
    }
  }
  return config;
});

// Refresh token handling: if a request fails with 401, attempt to refresh the access token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
}

authHttp.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refresh = tokenStorage.getRefresh();
      if (!refresh) {
        tokenStorage.clear();
        try {
          window.location.href = '/login';
        } catch {}
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (!originalRequest.headers) originalRequest.headers = {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authHttp(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await publicHttp.post('/auth/refresh/', { refresh });
        const newAccess = res.data?.access ?? res.data?.token ?? null;
        const newRefresh = res.data?.refresh ?? refresh;
        if (!newAccess) throw new Error('No access token returned from refresh endpoint');
        tokenStorage.set(newAccess, newRefresh);
        processQueue(null, newAccess);
        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return authHttp(originalRequest);
      } catch (e) {
        processQueue(e, null);
        tokenStorage.clear();
        try {
          window.location.href = '/login';
        } catch {}
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
