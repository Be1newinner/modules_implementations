import { createSlice } from "@reduxjs/toolkit";

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
      return {
        ...state,
        value: state.value + 1,
      };
    },
    decrease: (state) => {
      return {
        ...state,
        value: state.value - 1,
      };
    },
    reset: (state) => {
      return {
        ...state,
        value: initialState.value,
      };
    },
  },
  selectors: {
    value: (state) => state.value,
    loading: (state) => state.value,
    error: (state) => state.value,
  },
});

export const { increase, decrease, reset } = counterSlice.actions;
export const { value, loading, error } = counterSlice.selectors;
