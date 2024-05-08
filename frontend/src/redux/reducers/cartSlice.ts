import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductItem {
  id: number;
  name: string;
  quantity: number;
  prescription_id: boolean | undefined;
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
  product: ProductItem[];
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
      const { product_id, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product_id === product_id,
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalQuantity += quantity;
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === id,
      );
      if (existingItemIndex !== -1) {
        state.totalQuantity -= state.items[existingItemIndex].quantity;
        state.items.splice(existingItemIndex, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
