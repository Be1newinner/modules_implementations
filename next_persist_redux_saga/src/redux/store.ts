"use client";

import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./slices/counter.slice";
import { todoSlice } from "./slices/todo.slice";
import createSagaMiddleware from "redux-saga";

import RootSaga from "./root.saga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    Counter: counterSlice.reducer,
    Todo: todoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([sagaMiddleware]),
});

sagaMiddleware.run(RootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
