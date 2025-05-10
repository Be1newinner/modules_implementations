import { CounterAPI } from "@/services/counterAPI";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

export default function* counterSaga(action: PayloadAction<number>) {
  try {
    const response: {
      message: string;
      data: number;
    } = yield call(CounterAPI, action.payload);
    yield put({ type: "Counter/increaseSuccess", payload: response.data });
  } catch (error) {
    yield put({
      type: "Counter/increaseFailure",
      payload: (error as Error).message,
    });
  }
}

export function* watchCounterSaga() {
  //   yield takeEvery("Counter/increaseRequest", counterSaga);
  yield takeLatest("Counter/increaseRequest", counterSaga);
}
