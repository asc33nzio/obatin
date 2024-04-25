import type { PayloadAction } from '@reduxjs/toolkit';
import { AuthReduxItf } from '@/types/authTypes';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AuthReduxItf = {
  email: '',
  name: '',
  gender: 'laki-laki',
  birthDate: undefined,
  specialization: null,
  role: 'user',
  isVerified: false,
  isApproved: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthReduxItf>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.gender = action.payload.gender;
      state.birthDate = action.payload.birthDate;
      state.specialization = action.payload.specialization;
      state.role = action.payload.role;
      state.isVerified = action.payload.isVerified;
      state.isApproved = action.payload.isApproved;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;
