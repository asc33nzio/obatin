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
      state.pharmacies = [];
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
    removeItemFromPharmacyCart(state, action: PayloadAction<number>) {
      if (state.selectedPharmacy) {
        state.selectedPharmacy.cart_items =
          state.selectedPharmacy?.cart_items.filter(
            (cartItem) => cartItem.product_id !== action.payload,
          );
      }
    },
    increaseByOne(state, action: PayloadAction<number>) {
      if (state.selectedPharmacy) {
        const productId = action.payload;
        const cartItem = state.selectedPharmacy.cart_items.find(
          (item) => item.product_id === productId,
        );
        if (cartItem) {
          cartItem.quantity += 1;
        }
      }
    },
    deduceByOne(state, action: PayloadAction<number>) {
      if (state.selectedPharmacy) {
        const productId = action.payload;
        const updatedCartItems = state.selectedPharmacy.cart_items.map(
          (item) => {
            if (item.product_id === productId && item.quantity > 1) {
              return {
                ...item,
                quantity: item.quantity - 1,
              };
            }
            return item;
          },
        );
        state.selectedPharmacy.cart_items = updatedCartItems;
      }
    },
    resetPharmacyStates(state) {
      state.pharmacies = [];
      state.selectedPharmacy = null;
      state.paymentId = null;
    },
  },
});

export const {
  setPharmacies,
  setSelectedPharmacy,
  clearSelectedPharmacy,
  updateSelectedPharmacy,
  setPaymentId,
  removeItemFromPharmacyCart,
  increaseByOne,
  deduceByOne,
} = pharmacySlice.actions;

export default pharmacySlice.reducer;
