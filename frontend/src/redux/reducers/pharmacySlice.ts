import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductItemItf } from './cartSlice';

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
  shipping_id: number;
  shipping_name: string;
  shipping_cost: number;
  subtotal_pharmacy: number;
  cart_items: ProductItemItf[];
}

export interface PharmacyState {
  pharmacies: PharmacyCart[];
  selectedPharmacy: PharmacyCart | null;
  paymentId: number | null;
}

const initialState: PharmacyState = {
  pharmacies: [],
  selectedPharmacy: null,
  paymentId: null,
};

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    setPharmacies(state, action: PayloadAction<PharmacyState>) {
      state.pharmacies = action.payload.pharmacies;
    },
    setSelectedPharmacy(state, action: PayloadAction<PharmacyCart>) {
      state.selectedPharmacy = action.payload;
    },
    clearSelectedPharmacy(state) {
      state.selectedPharmacy = null;
    },
    updateSelectedPharmacy(
      state,
      action: PayloadAction<Partial<PharmacyCart>>,
    ) {
      if (state.selectedPharmacy) {
        state.selectedPharmacy = {
          ...state.selectedPharmacy,
          ...action.payload,
        };
      }
    },
    setPaymentId(state, action: PayloadAction<number>) {
      state.paymentId = action.payload;
    },
  },
});

export const {
  setPharmacies,
  setSelectedPharmacy,
  clearSelectedPharmacy,
  updateSelectedPharmacy,
  setPaymentId,
} = pharmacySlice.actions;

export default pharmacySlice.reducer;
