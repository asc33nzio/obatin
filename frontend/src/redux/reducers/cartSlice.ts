import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PharmacyCart } from './pharmacySlice';

export interface ProductItemItf {
  id: number;
  name: string;
  quantity: number;
  prescription_id: boolean | undefined;
  product_id: number;
  pharmacy_product_id: string;
  thumbnail_url: string;
  image_url: string;
  selling_unit: string;
  order_id: string;
  price: number;
  stock: number;
  weight: number;
  is_prescription_required: boolean;
}

export interface CartItem {
  product_id: number;
  prescription_id: number | null;
  pharmacy_id: number | null;
  quantity: number;
}
export interface CartState {
  items: CartItem[];
  product: PharmacyCart[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  product: [],
  totalQuantity: 0,
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { product_id } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product_id === product_id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.totalQuantity += 1;
    },

    deduceOneFromCart: (state, action: PayloadAction<CartItem>) => {
      const { product_id } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === product_id,
      );

      if (existingItemIndex === -1) return;
      const existingItem = state.items[existingItemIndex];

      if (existingItem?.quantity <= 1) {
        state.items = state.items.filter(
          (item) => item.product_id !== existingItem.product_id,
        );
        return;
      }
    },

    removeItemFromCart: (state, action: PayloadAction<CartItem>) => {
      const { product_id } = action.payload;
      const item = state.items.find((item) => item.product_id === product_id);

      if (item === undefined) return;

      state.totalQuantity -= item.quantity;
      state.items = state.items.filter(
        (item) => item.product_id !== item.product_id,
      );
    },

    updateQuantityCart: (state, action: PayloadAction<number>) => {
      state.totalQuantity = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.product = [];
      state.totalPrice = 0;
    },
  },
});

export const {
  addItemToCart,
  deduceOneFromCart,
  removeItemFromCart,
  clearCart,
  updateQuantityCart,
} = cartSlice.actions;

export default cartSlice.reducer;
