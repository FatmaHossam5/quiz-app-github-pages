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
      console.log('🔍 [IncomingQuizzesSlice] setIncomingQuizzes action dispatched');
      console.log('📊 [IncomingQuizzesSlice] Payload:', action.payload);
      console.log('📊 [IncomingQuizzesSlice] Payload type:', typeof action.payload);
      console.log('📊 [IncomingQuizzesSlice] Is array:', Array.isArray(action.payload));
      console.log('📊 [IncomingQuizzesSlice] Payload length:', Array.isArray(action.payload) ? action.payload.length : 'Not an array');
      
      state.incomingQuizzes = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetched = Date.now();
      
      console.log('✅ [IncomingQuizzesSlice] State updated successfully');
      console.log('📊 [IncomingQuizzesSlice] New state:', {
        incomingQuizzes: state.incomingQuizzes,
        loading: state.loading,
        error: state.error,
        lastFetched: state.lastFetched
      });
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