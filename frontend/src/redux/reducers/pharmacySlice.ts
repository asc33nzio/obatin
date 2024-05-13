import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductItemItf } from './cartSlice';

export interface PharmacyCart {
  id: number;
  name: string;
  quantity: number;
  address: string;
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
  shipping_service: string;
  shipping_estimation: string;
  subtotal_pharmacy: number;
  cart_items: ProductItemItf[];
}

export interface PharmacyState {
  pharmacies: PharmacyCart[];
  selectedPharmacy: PharmacyCart | null;
  paymentId: number | null;
  checkoutProductsQty: number;
  checkoutSubtotal: number;
  checkoutShipmentSubtotal: number;
}

export interface RemoveItemItf {
  product_id: number;
  pharmacy_id: number;
}

const initialState: PharmacyState = {
  pharmacies: [],
  selectedPharmacy: null,
  paymentId: null,
  checkoutProductsQty: 0,
  checkoutSubtotal: 0,
  checkoutShipmentSubtotal: 0,
};

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    setPharmacies(state, action: PayloadAction<Array<PharmacyCart>>) {
      if (action.payload === null) {
        state.pharmacies = [];
        return;
      }

      state.pharmacies = action.payload.map((pharmacy) => {
        const prevPharmaIndex = state.pharmacies.findIndex((prevPharmacy) => {
          return prevPharmacy.id === pharmacy.id;
        });

        if (prevPharmaIndex !== -1) {
          const originalValue = state.pharmacies[prevPharmaIndex];

          return {
            ...pharmacy,
            shipping_id: originalValue.shipping_id,
            shipping_name: originalValue.shipping_name,
            shipping_cost: originalValue.shipping_cost,
            shipping_service: originalValue.shipping_service,
            shipping_estimation: originalValue.shipping_estimation,
          };
        } else {
          return pharmacy;
        }
      });
    },

    setSelectedPharmacy(state, action: PayloadAction<PharmacyCart>) {
      state.selectedPharmacy = action.payload;
    },

    updateShippingInfo(state, action: PayloadAction<Partial<PharmacyCart>>) {
      if (state.selectedPharmacy) {
        const {
          shipping_id,
          shipping_cost,
          shipping_name,
          shipping_service,
          shipping_estimation,
        } = action.payload;
        const existingPharmacyIndex = state.pharmacies.findIndex(
          (pharmacy) => pharmacy.id === state.selectedPharmacy?.id,
        );

        if (
          existingPharmacyIndex === -1 ||
          shipping_id === undefined ||
          shipping_cost === undefined ||
          shipping_name === undefined ||
          shipping_service === undefined ||
          shipping_estimation === undefined
        )
          return;

        state.pharmacies[existingPharmacyIndex].shipping_id = shipping_id;
        state.pharmacies[existingPharmacyIndex].shipping_cost = shipping_cost;
        state.pharmacies[existingPharmacyIndex].shipping_name = shipping_name;
        state.pharmacies[existingPharmacyIndex].shipping_service =
          shipping_service;
        state.pharmacies[existingPharmacyIndex].shipping_estimation =
          shipping_estimation;
      }
    },

    setPaymentId(state, action: PayloadAction<number>) {
      state.paymentId = action.payload;
    },

    removeItemFromPharmacyCart(state, action: PayloadAction<RemoveItemItf>) {
      const { product_id, pharmacy_id } = action.payload;
      if (state.selectedPharmacy) {
        state.selectedPharmacy.cart_items =
          state.selectedPharmacy?.cart_items.filter(
            (cartItem) => cartItem.product_id !== product_id,
          );

        const pharmacyIndex = state.pharmacies.findIndex(
          (pharmacy) => pharmacy.id === pharmacy_id,
        );
        if (pharmacyIndex === -1) return;
        const pharmacy = state.pharmacies[pharmacyIndex];

        if (
          pharmacy.shipping_id !== undefined &&
          pharmacy.cart_items.length === 0
        ) {
          state.checkoutShipmentSubtotal -= pharmacy.shipping_cost;
        }
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

        const productInPharmaCart =
          state.pharmacies[pharmacyIndex].cart_items[productIndex];
        productInPharmaCart.quantity = productInPharmaCart.quantity += 1;

        if (state.pharmacies[pharmacyIndex].shipping_id !== undefined) {
          state.checkoutProductsQty -= 1;
          state.checkoutSubtotal -= productInPharmaCart.price;
        }
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

        const productInPharmaCart =
          state.pharmacies[pharmacyIndex].cart_items[productIndex];
        productInPharmaCart.quantity = productInPharmaCart.quantity -= 1;

        if (productInPharmaCart.quantity === 0) {
          state.pharmacies[pharmacyIndex].cart_items = state.pharmacies[
            pharmacyIndex
          ].cart_items.filter((product) => product.product_id !== productId);
        }

        if (state.pharmacies[pharmacyIndex].shipping_id !== undefined) {
          state.checkoutProductsQty -= 1;
          state.checkoutSubtotal -= productInPharmaCart.price;
        }
      }
    },

    updateCheckoutInfo(state, action: PayloadAction<Partial<PharmacyState>>) {
      const { checkoutShipmentSubtotal } = action.payload;
      if (checkoutShipmentSubtotal === undefined) return;

      if (!state.selectedPharmacy) return;
      const existingPharmacyIndex = state.pharmacies.findIndex(
        (pharmacy) => pharmacy.id === state.selectedPharmacy?.id,
      );

      if (existingPharmacyIndex === -1) return;
      if (state.pharmacies[existingPharmacyIndex].shipping_id !== undefined) {
        state.checkoutShipmentSubtotal -=
          state.pharmacies[existingPharmacyIndex].shipping_cost;
        state.checkoutShipmentSubtotal += checkoutShipmentSubtotal;
        return;
      }

      state.pharmacies[existingPharmacyIndex].cart_items.forEach((product) => {
        state.checkoutProductsQty += product.quantity;
        state.checkoutSubtotal += product.price * product.quantity;
      });
      state.checkoutShipmentSubtotal += checkoutShipmentSubtotal;
    },

    resetPharmacyStates(state) {
      state.pharmacies = [];
      state.selectedPharmacy = null;
      state.paymentId = null;
      state.checkoutProductsQty = 0;
      state.checkoutShipmentSubtotal = 0;
      state.checkoutSubtotal = 0;
    },
  },
});

export const {
  setPharmacies,
  setSelectedPharmacy,
  updateShippingInfo,
  setPaymentId,
  removeItemFromPharmacyCart,
  increaseByOne,
  deduceByOne,
  updateCheckoutInfo,
  resetPharmacyStates,
} = pharmacySlice.actions;
export const pharmacyReducer = pharmacySlice.reducer;
