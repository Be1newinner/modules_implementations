import { all } from "redux-saga/effects";
import { watchCounterSaga } from "./sagas/counter.saga";
import { watchCartSaga } from "./sagas/cart.saga";

export default function* RootSaga() {
  yield all([watchCounterSaga(), watchCartSaga()]);
}
