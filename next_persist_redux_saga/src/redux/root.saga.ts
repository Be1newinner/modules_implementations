import { all } from "redux-saga/effects";
import { watchCounterSaga } from "./sagas/counter.saga";

export default function* RootSaga() {
  yield all([watchCounterSaga()]);
}
