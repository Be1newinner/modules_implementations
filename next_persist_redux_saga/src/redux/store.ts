"use client";

import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./slices/counter.slice";

export const store = configureStore({
  reducer: {
    Counter: counterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
