"use client";

import { addItemTodo, selectNotes } from "@/redux/slices/todo.slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const [addInput, setAddInput] = useState("");

  const items = useSelector(selectNotes);
  const dispatch = useDispatch();

  function addInputFunction() {
    if (addInput.length > 0) {
      dispatch(addItemTodo({ title: addInput }));
      setAddInput("");
    }
  }

  return (
    <div className="todo_container max-h-[calc(100dvh-100px)] overflow-y-auto">
      <h1>TODO LIST</h1>
      <hr />
      <div className="flex gap-2">
        <input
          placeholder="add items..."
          className="border border-gray-400 basis-full p-2"
          value={addInput}
          onChange={(event) => {
            setAddInput(event.target.value);
          }}
        />

        <button className="black min-w-max" onClick={addInputFunction}>
          ADD ITEM
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {Object.values(items).map((e) => {
          return (
            <div
              key={e.id}
              className="bg-gray-800 p-2 rounded flex justify-between items-center border"
            >
              <p>{e.title}</p>
              <div className="*:border *:!border-gray-400 *:shadow">
                <button>Delete</button>
                <button>Edit</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
