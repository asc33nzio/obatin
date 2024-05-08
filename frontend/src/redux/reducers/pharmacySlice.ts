import { createSlice } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export interface PharmacyCart {
  id: number;
  name: string;
  quantity: number;
  address: number;
  city_id: number;
  lat: string;
  lng: string;
  pharmacist_name: string;
  pharmacist_license: string;
  pharmacist_phone: string;
  opening_time: string;
  closing_time: string;
  operational_days: [];
  partner_id: number;
  distance: number;
  total_weight: number;
  subtotal_pharmacy: number;
  cart_items: CartItem[];
}

export interface PharmacyState {
  pharmacies: PharmacyCart[];
}

const initialState: PharmacyState = {
  pharmacies: [],
};

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    setPharmacies(state, action) {
      state.pharmacies = action.payload;
    },
  },
});

export const { setPharmacies } = pharmacySlice.actions;
export default pharmacySlice.reducer;
