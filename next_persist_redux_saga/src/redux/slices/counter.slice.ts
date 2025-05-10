import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateInterface {
  value: number;
  loading: boolean;
  error: string;
}

const initialState: initialStateInterface = {
  value: 0,
  loading: false,
  error: "",
};

export const counterSlice = createSlice({
  name: "Counter",
  initialState,
  reducers: {
    increase: (state) => {
      state.value++;
    },
    decrease: (state) => {
      state.value--;
    },
    reset: (state) => {
      state.value = 0;
    },
    increaseRequest: (state, _action: PayloadAction<number>) => {
      state.loading = true;
      state.error = "";
    },
    increaseSuccess: (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.value += action.payload;
    },
    increaseFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  selectors: {
    selectValue: (state) => state.value,
    selectLoading: (state) => state.value,
    selectError: (state) => state.value,
  },
});

export const {
  increase,
  decrease,
  reset,
  increaseRequest,
  increaseSuccess,
  increaseFailure,
} = counterSlice.actions;
export const { selectValue, selectLoading, selectError } =
  counterSlice.selectors;
