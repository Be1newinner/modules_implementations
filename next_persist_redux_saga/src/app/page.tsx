"use client";

import {
  increase,
  increaseRequest,
  selectLoading,
  selectValue,
} from "@/redux/slices/counter.slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const data = useSelector(selectValue);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Loading: ", loading);
  }, [loading]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>React Hook Demo</h1>
        <p>Counter: {data}</p>
        <button onClick={() => dispatch(increase())}>Increase</button>
        <button onClick={() => dispatch(increaseRequest(data))}>
          Increase Saga
        </button>
      </main>
    </div>
  );
}
