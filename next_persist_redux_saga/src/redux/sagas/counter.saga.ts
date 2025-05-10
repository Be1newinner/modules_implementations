import { CounterAPI } from "@/services/counterAPI";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  increaseFailure,
  increaseRequest,
  increaseSuccess,
} from "../slices/counter.slice";

export default function* counterSaga(action: PayloadAction<number>) {
  try {
    const response: {
      message: string;
      data: number;
    } = yield call(CounterAPI, action.payload);
    yield put(increaseSuccess(response.data));
  } catch (error) {
    yield put(increaseFailure((error as Error).message));
  }
}

export function* watchCounterSaga() {
  //   yield takeEvery("Counter/increaseRequest", counterSaga);
  yield takeLatest(increaseRequest, counterSaga);
}
