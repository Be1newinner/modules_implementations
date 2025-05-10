import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

interface note {
  id: string;
  title: string;
}

interface initialStateInterface {
  notes: Record<string, note>;
  loading: boolean;
  error: string;
}

const initialState: initialStateInterface = {
  notes: {},
  loading: false,
  error: "",
};

export const todoSlice = createSlice({
  name: "Todo",
  initialState,
  reducers: {
    addItemTodo: (state, action: PayloadAction<{ title: string }>) => {
      // const id = crypto.randomUUID();
      const id = uuidv4();
      state.notes[id] = {
        id,
        title: action.payload.title,
      };
    },
    editItemTodo: (
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const { id, title } = action.payload;
      if (state.notes[id]) {
        state.notes[id].title = title;
      }
    },
    deleteItemTodo: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (state.notes[id]) {
        delete state.notes[id];
      }
    },
    clearTodo: (state) => {
      state.notes = {};
    },
  },
  selectors: {
    selectNotes: (state) => state.notes,
    // selectNotes1: (state) => state.notes["1"],
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error,
  },
});

// const todoz = {
//   a: {
//     id: "a",
//     title: "Todo 1",
//   },
//   b: {
//     id: "b",
//     title: "Todo 2",
//   },
//   c: {
//     id: "c",
//     title: "Todo 3",
//   },
// };

export const dynamicTodoSelectors = {
  makeSelectNoteById: (id: string) => {
    return createSelector([selectNotes], (notes) => notes[id]);
  },
};

export const { addItemTodo, clearTodo, deleteItemTodo, editItemTodo } =
  todoSlice.actions;
export const { selectError, selectLoading, selectNotes } = todoSlice.selectors;
