import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image_url: string;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalQuantity += quantity;
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === id);
      if (existingItemIndex !== -1) {
        state.totalQuantity -= state.items[existingItemIndex].quantity;
        state.items.splice(existingItemIndex, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
    cartSummary: (state, action: PayloadAction<CartState>) => {
      const { items, totalQuantity, totalPrice } = action.payload;
      const existingItem = state.items.find(items.indexOf);
      if (existingItem) {
        existingItem.quantity += totalQuantity;
        existingItem.price * existingItem.quantity == totalPrice;
      } else {
        state.items.push();
      }
      state.totalQuantity += totalQuantity;
      state.totalPrice += totalPrice;
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
