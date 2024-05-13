import type { PayloadAction } from '@reduxjs/toolkit';
import { AuthDoctorReduxItf } from '@/types/reduxTypes';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AuthDoctorReduxItf = {
  aid: 0,
  email: '',
  name: '',
  role: 'doctor',
  isVerified: false,
  isApproved: false,
  avatarUrl: '',
  specialization: '',
  isOnline: false,
  experiences: 0,
  certificate: '',
  fee: 0,
  openingTime: '',
  operationalHours: '',
  operationalDays: [],
};

const authDoctorSlice = createSlice({
  name: 'authDoctor',
  initialState,
  reducers: {
    setAuthDoctorState: (state, action: PayloadAction<AuthDoctorReduxItf>) => {
      state.aid = action.payload.aid;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.isVerified = action.payload.isVerified;
      state.isApproved = action.payload.isApproved;
      state.avatarUrl = action.payload.avatarUrl;
      state.specialization = action.payload.specialization;
      state.isOnline = action.payload.isOnline;
      state.experiences = action.payload.experiences;
      state.certificate = action.payload.certificate;
      state.fee = action.payload.fee;
      state.openingTime = action.payload.openingTime;
      state.operationalHours = action.payload.operationalHours;
      state.operationalDays = action.payload.operationalDays;
    },
    resetAuthDoctorState: (state) => {
      state.aid = 0;
      state.email = '';
      state.name = '';
      state.role = 'doctor';
      state.isVerified = false;
      state.isApproved = false;
      state.avatarUrl = '';
      state.specialization = '';
      state.isOnline = false;
      state.experiences = 0;
      state.certificate = '';
      state.fee = 0;
      state.openingTime = '';
      state.operationalHours = '';
      state.operationalDays = [];
    },
  },
});

export const { setAuthDoctorState, resetAuthDoctorState } =
  authDoctorSlice.actions;
export const authDoctorReducer = authDoctorSlice.reducer;
