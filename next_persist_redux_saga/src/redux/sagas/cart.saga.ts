import { call, put, takeLatest } from "redux-saga/effects";
import {
  getCartRequest,
  getCartRequestFailed,
  getCartSuccess,
} from "../slices/cart.slice";
import { getAllCartAPI, getAllCartAPIResponse } from "@/services/cartAPI";

export default function* cartSaga() {
  try {
    const response: getAllCartAPIResponse = yield call(getAllCartAPI);
    console.log("response", response);
    if (response) {
      yield put(getCartSuccess(response));
    } else {
      yield put(getCartRequestFailed("No data found"));
    }
  } catch (error) {
    yield put(getCartRequestFailed((error as Error).message));
  }
}

export function* watchCartSaga() {
  yield takeLatest(getCartRequest, cartSaga);
}
