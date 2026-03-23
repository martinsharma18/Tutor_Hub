import { createSlice } from "@reduxjs/toolkit";

const storageKey = "tuition-platform-auth";

// Check if token is expired
const isTokenExpired = (expiresAtUtc) => {
  if (!expiresAtUtc) return true;
  try {
    const expiryDate = new Date(expiresAtUtc);
    return expiryDate < new Date();
  } catch {
    return true;
  }
};

const loadFromStorage = () => {
  if (typeof window === "undefined") {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAtUtc: null,
    };
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        expiresAtUtc: null,
      };
    }

    const parsed = JSON.parse(raw);
    
    // Check if token is expired and clear if so
    if (isTokenExpired(parsed.expiresAtUtc)) {
      window.localStorage.removeItem(storageKey);
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        expiresAtUtc: null,
      };
    }

    return parsed;
  } catch {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAtUtc: null,
    };
  }
};

const persist = (state) => {
  if (typeof window === "undefined") return;
  
  // Don't persist if token is expired
  if (isTokenExpired(state.expiresAtUtc)) {
    wipe();
    return;
  }
  
  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

const wipe = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey);
};

const persisted = loadFromStorage();

// Clear expired tokens
const cleanedPersisted = isTokenExpired(persisted.expiresAtUtc)
  ? {
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAtUtc: null,
    }
  : persisted;

const initialState = {
  ...cleanedPersisted,
  initialized: true, // Set to true immediately since we've loaded from storage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAtUtc = action.payload.expiresAtUtc;
      state.initialized = true;
      persist({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAtUtc: state.expiresAtUtc,
      });
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAtUtc = null;
      state.initialized = true;
      wipe();
    },
    initializeAuth(state) {
      // Re-check localStorage in case it was updated
      const fresh = loadFromStorage();
      if (fresh.accessToken && !isTokenExpired(fresh.expiresAtUtc)) {
        state.user = fresh.user;
        state.accessToken = fresh.accessToken;
        state.refreshToken = fresh.refreshToken;
        state.expiresAtUtc = fresh.expiresAtUtc;
      } else if (isTokenExpired(state.expiresAtUtc)) {
        // Clear expired state
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresAtUtc = null;
        wipe();
      }
      state.initialized = true;
    },
  },
});

export const { setCredentials, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUserRole = (state) => state.auth.user?.role ?? null;

