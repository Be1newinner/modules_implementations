"use client";

import {
  addItemTodo,
  selectNotes,
  deleteItemTodo,
  editItemTodo,
  clearTodo,
  // dynamicTodoSelectors,
} from "@/redux/slices/todo.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const [addInput, setAddInput] = useState("");

  const items = useSelector(selectNotes);
  // const sSelector = useSelector(
  //   dynamicTodoSelectors.makeSelectNoteById(
  //     "6a9a4552-0d7e-4109-97b9-7cf0e38d7f71"
  //   )
  // );
  const dispatch = useDispatch();

  function addInputFunction() {
    if (addInput.length > 0) {
      dispatch(addItemTodo({ title: addInput }));
      setAddInput("");
    }
  }

  function deleteInputFunction(id: string) {
    dispatch(deleteItemTodo({ id }));
  }
  function editInputFunction(id: string, title: string) {
    const newItem = prompt("Edit item", title);
    if (newItem === null) return;
    if (newItem.length === 0) {
      alert("Please enter a valid item");
      return;
    }
    dispatch(editItemTodo({ id, title: newItem }));
  }
  function clearInputFunction() {
    dispatch(clearTodo());
  }

  // useEffect(() => {
  //   console.log("sSelector", sSelector);
  // }, [sSelector]);

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
                <button onClick={() => deleteInputFunction(e.id)}>
                  Delete
                </button>
                <button onClick={() => editInputFunction(e.id, e.title)}>
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
