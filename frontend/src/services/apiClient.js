import axios from "axios";
import { store } from "../store";
import { logout, setCredentials } from "../store/authSlice";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5083/api";

// Uploaded files (see LocalFileStorageService) are served from the API's root, not under /api —
// resolve a relative "/uploads/..." URL returned by the upload endpoint into an absolute one.
export const apiOrigin = baseURL.replace(/\/api\/?$/, "");
export const resolveFileUrl = (relativeUrl) =>
  !relativeUrl || /^https?:\/\//i.test(relativeUrl) ? relativeUrl : `${apiOrigin}${relativeUrl}`;

const apiClient = axios.create({
  baseURL,
  withCredentials: false,
});

// Separate instance with no interceptors, used only for the refresh call itself — attaching this
// to apiClient would recurse into the 401 handler below if the refresh call also came back 401.
const refreshClient = axios.create({ baseURL, withCredentials: false });

// Ensures concurrent 401s trigger exactly one refresh call instead of a stampede, each request
// awaiting the same in-flight promise.
let refreshPromise = null;

async function refreshAccessToken() {
  const state = store.getState();
  const { accessToken, refreshToken } = state.auth;
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh", { accessToken, refreshToken })
      .then((res) => res.data)
      .finally(() => {
        refreshPromise = null;
      });
  }

  const data = await refreshPromise;
  store.dispatch(setCredentials(data));
  return data.accessToken;
}

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log network errors for debugging
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || !error.response) {
      console.error('Network Error:', {
        message: error.message,
        code: error.code,
        baseURL: apiClient.defaults.baseURL,
        url: error.config?.url,
      });
    }

    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.startsWith("/auth/");

    // A 401 used to log the user out immediately, even for a routine expired access token.
    // Now it retries once via /auth/refresh, and only logs out if the refresh itself fails.
    if (error.response?.status === 401 && !originalRequest?._retried && !isAuthEndpoint) {
      originalRequest._retried = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiClient;

