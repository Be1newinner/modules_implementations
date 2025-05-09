import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      const id = crypto.randomUUID();
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
    selectLoading: (state) => state.loading,
    selectError: (state) => state.error,
  },
});

export const makeSelectNoteById = (id: number) =>
  createSelector([selectNotes], (notes) => notes[id]);

export const { addItemTodo, clearTodo, deleteItemTodo, editItemTodo } =
  todoSlice.actions;
export const { selectError, selectLoading, selectNotes } = todoSlice.selectors;
