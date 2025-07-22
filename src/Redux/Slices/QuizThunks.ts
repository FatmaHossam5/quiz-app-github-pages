import { createAsyncThunk } from '@reduxjs/toolkit';
import { quizService } from '../../services/api';
import { setIncomingQuizzes, setLoading as setIncomingLoading, setError as setIncomingError } from './incomingQuizzesSlice/incomingQuizzesSlice';
import { setCompletedQuizzes, setLoading as setCompletedLoading, setError as setCompletedError } from './CompletedQuizzes/CompletedQuizzes';
import { Quiz } from '../../types';

// Thunk for fetching incoming quizzes
export const fetchIncomingQuizzes = createAsyncThunk(
  'quizzes/fetchIncoming',
  async (_, { dispatch }) => {
    try {
      dispatch(setIncomingLoading(true));
      
      const data = await quizService.getIncomingQuizzes() as Quiz[];
      
      
      // Ensure data is an array before dispatching
      const quizArray = Array.isArray(data) ? data : [];
    
      dispatch(setIncomingQuizzes(quizArray));
     
      
      return data;
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Failed to fetch incoming quizzes';
      dispatch(setIncomingError(errorMessage));
      throw error;
    }
  }
);

// Thunk for fetching completed quizzes based on user role
export const fetchCompletedQuizzes = createAsyncThunk(
  'quizzes/fetchCompleted',
  async (role: 'Student' | 'Instructor', { dispatch }) => {
    try {
      dispatch(setCompletedLoading(true));
      const data = await quizService.getCompletedQuizzes() as Quiz[];
      dispatch(setCompletedQuizzes(data));
      return data;
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Failed to fetch completed quizzes';
      dispatch(setCompletedError(errorMessage));
      throw error;
    }
  }
);

// Thunk for fetching both incoming and completed quizzes
export const fetchAllQuizzes = createAsyncThunk(
  'quizzes/fetchAll',
  async (role: 'Student' | 'Instructor', { dispatch }) => {
    try {
      dispatch(setIncomingLoading(true));
      dispatch(setCompletedLoading(true));
      
      const [incomingData, completedData] = await Promise.all([
        quizService.getIncomingQuizzes(),
        quizService.getCompletedQuizzes()
      ]);
      
      
      
      dispatch(setIncomingQuizzes(incomingData as Quiz[]));
      dispatch(setCompletedQuizzes(completedData as Quiz[]));
      
      
      return { incoming: incomingData, completed: completedData };
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Failed to fetch quizzes';
      dispatch(setIncomingError(errorMessage));
      dispatch(setCompletedError(errorMessage));
      throw error;
    }
  }
); 