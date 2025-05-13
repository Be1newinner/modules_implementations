import { getAllCartAPIResponse } from "@/services/cartAPI";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateInterface {
  cart: {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  loading: boolean;
  error: string;
}

const initialState: initialStateInterface = {
  cart: [],
  loading: false,
  error: "",
};

export const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    getCartRequest: (state) => {
      state.loading = true;
      state.error = "";
    },
    getCartSuccess: (state, action: PayloadAction<getAllCartAPIResponse>) => {
      state.loading = false;
      state.error = "";
      state.cart = action.payload;
    },
    getCartRequestFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.cart = [];
    },
  },
  selectors: {
    selectCart: (state) => state.cart,
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error,
  },
});

export const dynamiccartSelectors = {
  selectCartProductByID: (id: string) => {
    return createSelector([selectCart], (cart) =>
      cart.find((item) => item.id === Number(id))
    );
  },
};

export const { getCartRequest, getCartSuccess, getCartRequestFailed } =
  cartSlice.actions;
export const { selectError, selectLoading, selectCart } = cartSlice.selectors;
