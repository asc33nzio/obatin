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

        const { shipping_id, shipping_cost, shipping_name } = action.payload;
        const existingPharmacyIndex = state.pharmacies.findIndex(
          (pharmacy) => pharmacy.id === state.selectedPharmacy?.id,
        );

        if (
          existingPharmacyIndex === -1 ||
          shipping_id === undefined ||
          shipping_cost === undefined ||
          shipping_name === undefined
        )
          return;
        state.pharmacies[existingPharmacyIndex].shipping_id = shipping_id;
        state.pharmacies[existingPharmacyIndex].shipping_cost = shipping_cost;
        state.pharmacies[existingPharmacyIndex].shipping_name = shipping_name;
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

        const pharmacyIndex = state.pharmacies.findIndex(
          (pharmacy) => pharmacy.id === state.selectedPharmacy?.id,
        );
        if (pharmacyIndex === -1) return;

        const productIndex = state.pharmacies[
          pharmacyIndex
        ].cart_items.findIndex((product) => product.product_id === productId);
        if (productIndex === -1) return;

        state.pharmacies[pharmacyIndex].cart_items[productIndex].quantity =
          state.pharmacies[pharmacyIndex].cart_items[productIndex].quantity +=
            1;
      }
    },
    deduceByOne(state, action: PayloadAction<number>) {
      if (state.selectedPharmacy) {
        const productId = action.payload;

        const pharmacyIndex = state.pharmacies.findIndex(
          (pharmacy) => pharmacy.id === state.selectedPharmacy?.id,
        );
        if (pharmacyIndex === -1) return;

        const productIndex = state.pharmacies[
          pharmacyIndex
        ].cart_items.findIndex((product) => product.product_id === productId);
        if (productIndex === -1) return;

        state.pharmacies[pharmacyIndex].cart_items[productIndex].quantity =
          state.pharmacies[pharmacyIndex].cart_items[productIndex].quantity -=
            1;

        if (
          state.pharmacies[pharmacyIndex].cart_items[productIndex].quantity ===
          0
        ) {
          state.pharmacies[pharmacyIndex].cart_items = state.pharmacies[
            pharmacyIndex
          ].cart_items.filter((product) => product.product_id !== productId);
        }
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
  resetPharmacyStates,
} = pharmacySlice.actions;

export default pharmacySlice.reducer;
