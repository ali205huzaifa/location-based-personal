import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/user';

interface AuthState {
  currentUser: User | null;
  token: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  token: null,
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
      }>
    ) => {
      state.currentUser = action.payload.currentUser;
      state.token = action.payload.token;
    },
    clearAuthData: (state) => {
      state.currentUser = null;
      state.token = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
