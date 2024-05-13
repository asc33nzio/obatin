import type { PayloadAction } from '@reduxjs/toolkit';
import { ProvincesItf } from '@/types/reduxTypes';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ProvincesItf = {
  provinces: [],
};

const provincesSlice = createSlice({
  name: 'provinces',
  initialState,
  reducers: {
    setProvincesState: (state, action: PayloadAction<ProvincesItf>) => {
      state.provinces = action.payload.provinces;
    },
  },
});

export const { setProvincesState } = provincesSlice.actions;
export const provincesReducer = provincesSlice.reducer;
