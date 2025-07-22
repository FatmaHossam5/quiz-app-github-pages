import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz } from "../../../types";

interface CompletedQuizzesState {
  completedQuizzes: Quiz[] | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: CompletedQuizzesState = {
  completedQuizzes: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const completedQuizzesSlice = createSlice({
  name: "completedQuizzes",
  initialState,
  reducers: {
    setCompletedQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.completedQuizzes = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetched = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearQuizzes: (state) => {
      state.completedQuizzes = null;
      state.error = null;
      state.lastFetched = null;
    },
  },
});

export const { 
  setCompletedQuizzes, 
  setLoading, 
  setError, 
  clearQuizzes 
} = completedQuizzesSlice.actions;

export default completedQuizzesSlice.reducer;
