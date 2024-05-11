import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface CartItemItf {
  product_id: number;
  prescription_id: number | null;
  pharmacy_id: number | null;
  quantity: number;
}

export interface CartStateItf {
  items: CartItemItf[];
  totalQuantity: number;
  totalPrice: number;
}

export interface SyncCartItf {
  product_id: number;
  quantity: number;
}

const initialState: CartStateItf = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    syncCartItem: (state, action: PayloadAction<SyncCartItf>) => {
      const { product_id, quantity } = action.payload;

      state.items.push({
        product_id,
        prescription_id: null,
        pharmacy_id: null,
        quantity,
      });

      state.totalQuantity += quantity;
    },

    syncTotalPrice: (state, action: PayloadAction<number>) => {
      const totalPrice = action.payload;

      state.totalPrice = totalPrice;
    },

    increaseOneToCart: (state, action: PayloadAction<number>) => {
      const product_id = action.payload;
      const existingItem = state.items.find(
        (item) => item.product_id === product_id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          product_id: product_id,
          prescription_id: null,
          pharmacy_id: null,
          quantity: 1,
        });
      }

      state.totalQuantity += 1;
    },

    deduceOneFromCart: (state, action: PayloadAction<CartItemItf>) => {
      const { product_id } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === product_id,
      );

      if (existingItemIndex === -1) return;
      const existingItem = state.items[existingItemIndex];
      existingItem.quantity -= 1;
      state.totalQuantity -= 1;

      if (existingItem?.quantity === 0) {
        state.items.splice(existingItemIndex, 1);
        return;
      }
    },

    removeItemFromCart: (state, action: PayloadAction<CartItemItf>) => {
      const { product_id } = action.payload;

      const removedItem = state.items.find(
        (item) => item.product_id === product_id,
      );
      if (removedItem) {
        state.totalQuantity -= removedItem.quantity;
      }

      state.items = state.items.filter(
        (item) => item.product_id !== product_id,
      );
    },

    updateQuantityCart: (state, action: PayloadAction<number>) => {
      state.totalQuantity = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  syncCartItem,
  syncTotalPrice,
  increaseOneToCart,
  deduceOneFromCart,
  removeItemFromCart,
  clearCart,
  updateQuantityCart,
} = cartSlice.actions;

export default cartSlice.reducer;
