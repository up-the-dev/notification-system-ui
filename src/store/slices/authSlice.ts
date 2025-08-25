import { createSlice, PayloadInterface } from '@reduxjs/toolkit';

interface User {
  user_id: string;
  email: string;
  client_id: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  clientId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  clientId: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadInterface<{ token: string; clientId: string; user: User }>) => {
      state.token = action.payload.token;
      state.clientId = action.payload.clientId;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.clientId = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadInterface<boolean>) => {
      state.loading = action.payload;
    },
    initializeAuth: (state, action: PayloadInterface<{ token: string; clientId: string; user: User }>) => {
      state.token = action.payload.token;
      state.clientId = action.payload.clientId;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
    },
  },
});

export const { loginSuccess, logout, setLoading, initializeAuth } = authSlice.actions;
export default authSlice.reducer;