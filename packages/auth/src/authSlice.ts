import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@nero/query-api-service';

export const STORAGE_REMEMBER = 'rememberMe';
export const STORAGE_USER_LOGGED_IN = 'isUserLogged';

export interface AuthenticatePayload {
  user: User;
  rememberMe?: boolean;
}

// interface for slice state
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  failed: boolean;
  user: User | null;
  isTokenRefreshing?: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  failed: false,
  user: null,
  isTokenRefreshing: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state, action: PayloadAction<AuthenticatePayload>) => {
      const { user, rememberMe } = action.payload;

      Object.assign(state, { isLoading: false, isAuthenticated: true, user });

      if (rememberMe != undefined) {
        localStorage.setItem(STORAGE_REMEMBER, JSON.stringify(rememberMe));
      }

      sessionStorage.setItem(STORAGE_USER_LOGGED_IN, JSON.stringify(true));
    },
    authenticationFailed: (state) => {
      Object.assign(state, { isLoading: false, failed: true });
    },
    logout: (state) => {
      Object.assign(state, { isAuthenticated: false, user: null });
      localStorage.removeItem(STORAGE_REMEMBER);
      sessionStorage.removeItem(STORAGE_USER_LOGGED_IN);
    },
    setIsTokenRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isTokenRefreshing = action.payload;
    },
  },
});

export const { authenticate, logout, authenticationFailed, setIsTokenRefreshing } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
