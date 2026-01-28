import axios from "axios";
import { tokenStorage } from "../storage/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL;

// In development use the Vite proxy by calling the relative `/api` path.
// In production use the real API URL from env.
const baseURL = import.meta.env.DEV ? '/api' : `${API_URL}/api`;

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
