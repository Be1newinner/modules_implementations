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
    selectValue: (state) => state.value,
    selectLoading: (state) => state.value,
    selectError: (state) => state.value,
  },
});

export const { increase, decrease, reset } = counterSlice.actions;
export const { selectValue, selectLoading, selectError } =
  counterSlice.selectors;
