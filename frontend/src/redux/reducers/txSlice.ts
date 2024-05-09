import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
};

export const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {
    setTxState: (state, action) => {
      state.orders = action.payload;
    },
    resetTxState: (state) => {
      state.orders = [];
    },
  },
});

export const { setTxState, resetTxState } = txSlice.actions;
export const txReducer = txSlice.reducer;
