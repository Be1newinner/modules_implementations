import { cartSlice } from "./slices/cart.slice";
import { counterSlice } from "./slices/counter.slice";
import { todoSlice } from "./slices/todo.slice";

export const rootReducer = {
  Counter: counterSlice.reducer,
  Todo: todoSlice.reducer,
  Cart: cartSlice.reducer,
};
