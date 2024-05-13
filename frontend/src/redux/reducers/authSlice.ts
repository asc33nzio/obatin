import type { PayloadAction } from '@reduxjs/toolkit';
import { AuthReduxItf } from '@/types/reduxTypes';
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
  activeAddressId: null,
  addresses: [],
};

const authSlice = createSlice({
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
      state.isApproved = action.payload.isApproved;
      state.avatarUrl = action.payload.avatarUrl;
      if (action.payload.activeAddressId) {
        state.activeAddressId = action.payload.activeAddressId;
      }
      if (action.payload.addresses) {
        state.addresses = action.payload.addresses;
      }
    },
    resetAuthState: (state) => {
      state.aid = 0;
      state.email = '';
      state.name = '';
      state.gender = 'laki-laki';
      state.birthDate = undefined;
      state.role = 'user';
      state.isVerified = false;
      state.isApproved = false;
      state.avatarUrl = '';
      state.activeAddressId = null;
      state.addresses = [];
    },
  },
});

export const { setAuthState, resetAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;
