import { ReduxTxItf } from '@/types/reduxTypes';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ReduxTxItf = {
  info: {
    order_id: 0,
    payment_id: 0,
    invoice_number: '',
    status: 'waiting_payment',
    number_items: 0,
    subtotal: 0,
    created_at: '',
    shipping: {
      cost: 0,
      code: '',
      name: '',
      type: '',
    },
    pharmacy: {
      id: 0,
      name: '',
      address: '',
      city_id: 0,
      lat: '',
      lng: '',
      pharmacist_name: '',
      pharmacist_license: '',
      pharmacist_phone: '',
      opening_time: '',
      closing_time: '',
      operational_days: [],
      partner_id: 0,
      distance: 0,
      total_weight: 0,
      subtotal_pharmacy: 0,
      cart_items: null,
    },
  },
  products: [],
};

const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {
    setTxState: (state, action) => {
      state.info = action.payload.info;
      state.products = action.payload.products;
    },
    resetTxState: (state) => {
      state.products = [];
    },
  },
});

export const { setTxState, resetTxState } = txSlice.actions;
export const txReducer = txSlice.reducer;
