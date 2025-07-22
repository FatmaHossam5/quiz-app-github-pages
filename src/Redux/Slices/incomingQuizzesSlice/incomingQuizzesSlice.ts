import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz } from "../../../types";

interface IncomingQuizzesState {
  incomingQuizzes: Quiz[] | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: IncomingQuizzesState = {
  incomingQuizzes: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const incomingQuizzesSlice = createSlice({
  name: "incomingQuizzes",
  initialState,
  reducers: {
    setIncomingQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.incomingQuizzes = action.payload;
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
      state.incomingQuizzes = null;
      state.error = null;
      state.lastFetched = null;
    },
  },
});

export const { 
  setIncomingQuizzes, 
  setLoading, 
  setError, 
  clearQuizzes 
} = incomingQuizzesSlice.actions;

export default incomingQuizzesSlice.reducer; 