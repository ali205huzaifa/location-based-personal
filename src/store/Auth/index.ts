import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

interface AuthState {
  currentUser: User | null;
  token: string | null;
  permissions: string[];
}

const initialState: AuthState = {
  currentUser: null,
  token: null,
  permissions: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (
      state,
      action: PayloadAction<{
        currentUser: User;
        token: string;
        permissions: string[];
      }>
    ) => {
      state.currentUser = action.payload.currentUser;
      state.token = action.payload.token;
      state.permissions = action.payload.permissions;
    },
    clearAuthData: (state) => {
      state.currentUser = null;
      state.token = null;
      state.permissions = [];
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
