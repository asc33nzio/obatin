import type { PayloadAction } from '@reduxjs/toolkit';
import { AuthReduxItf } from '@/types/authTypes';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AuthReduxItf = {
  aid: 0,
  email: '',
  name: '',
  gender: 'laki-laki',
  birthDate: undefined,
  role: 'user',
  isVerified: false,
  isApproved: false,
  avatarUrl: '',
  specialization: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthReduxItf>) => {
      state.aid = action.payload.aid;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.gender = action.payload.gender;
      state.birthDate = action.payload.birthDate;
      state.role = action.payload.role;
      state.isVerified = action.payload.isVerified;
      state.avatarUrl = action.payload.avatarUrl;
      state.isApproved = action.payload.isApproved;
      if (action.payload.specialization) {
        state.specialization = action.payload.specialization;
      }
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;
