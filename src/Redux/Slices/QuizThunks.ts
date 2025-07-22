import { createAsyncThunk } from '@reduxjs/toolkit';
import { quizService } from '../../services/api';
import { setIncomingQuizzes, setLoading as setIncomingLoading, setError as setIncomingError } from './incomingQuizzesSlice/incomingQuizzesSlice';
import { setCompletedQuizzes, setLoading as setCompletedLoading, setError as setCompletedError } from './CompletedQuizzes/CompletedQuizzes';
import { Quiz } from '../../types';

// Thunk for fetching incoming quizzes based on user role
export const fetchIncomingQuizzes = createAsyncThunk(
  'quizzes/fetchIncoming',
  async (role: 'Student' | 'Instructor', { dispatch }) => {
    console.log('🔍 [QuizThunks] fetchIncomingQuizzes() called with role:', role);
    try {
      console.log('🔍 [QuizThunks] Dispatching setIncomingLoading(true)');
      dispatch(setIncomingLoading(true));
      
      console.log('🔍 [QuizThunks] Calling quizService.getIncomingQuizzes()');
      const data = await quizService.getIncomingQuizzes() as Quiz[];
      console.log('✅ [QuizThunks] quizService.getIncomingQuizzes() successful');
      console.log('📊 [QuizThunks] Received data:', data);
      console.log('📊 [QuizThunks] Data type:', typeof data);
      console.log('📊 [QuizThunks] Is array:', Array.isArray(data));
      console.log('📊 [QuizThunks] Data length:', Array.isArray(data) ? data.length : 'Not an array');
      
      // Ensure data is an array before dispatching
      const quizArray = Array.isArray(data) ? data : [];
      console.log('🔍 [QuizThunks] Dispatching setIncomingQuizzes with array:', quizArray);
      dispatch(setIncomingQuizzes(quizArray));
      console.log('✅ [QuizThunks] setIncomingQuizzes dispatched successfully');
      
      return data;
    } catch (error: any) {
      console.error('❌ [QuizThunks] fetchIncomingQuizzes() failed:', error);
      const errorMessage = error.message || 'Failed to fetch incoming quizzes';
      console.log('🔍 [QuizThunks] Dispatching setIncomingError with message:', errorMessage);
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
      const data = await quizService.getCompletedQuizzes(role) as Quiz[];
      dispatch(setCompletedQuizzes(data));
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch completed quizzes';
      dispatch(setCompletedError(errorMessage));
      throw error;
    }
  }
);

// Thunk for fetching both incoming and completed quizzes
export const fetchAllQuizzes = createAsyncThunk(
  'quizzes/fetchAll',
  async (role: 'Student' | 'Instructor', { dispatch }) => {
    console.log('🔍 [QuizThunks] fetchAllQuizzes() called with role:', role);
    try {
      console.log('🔍 [QuizThunks] Dispatching setIncomingLoading(true) and setCompletedLoading(true)');
      dispatch(setIncomingLoading(true));
      dispatch(setCompletedLoading(true));
      
      console.log('🔍 [QuizThunks] Making parallel API calls...');
      const [incomingData, completedData] = await Promise.all([
        quizService.getIncomingQuizzes(),
        quizService.getCompletedQuizzes(role)
      ]);
      
      console.log('✅ [QuizThunks] Both API calls completed successfully');
      console.log('📊 [QuizThunks] Incoming data:', incomingData);
      console.log('📊 [QuizThunks] Completed data:', completedData);
      
      console.log('🔍 [QuizThunks] Dispatching setIncomingQuizzes with incoming data');
      dispatch(setIncomingQuizzes(incomingData as Quiz[]));
      console.log('🔍 [QuizThunks] Dispatching setCompletedQuizzes with completed data');
      dispatch(setCompletedQuizzes(completedData as Quiz[]));
      
      console.log('✅ [QuizThunks] Both Redux actions dispatched successfully');
      
      return { incoming: incomingData, completed: completedData };
    } catch (error: any) {
      console.error('❌ [QuizThunks] fetchAllQuizzes() failed:', error);
      const errorMessage = error.message || 'Failed to fetch quizzes';
      console.log('🔍 [QuizThunks] Dispatching error actions with message:', errorMessage);
      dispatch(setIncomingError(errorMessage));
      dispatch(setCompletedError(errorMessage));
      throw error;
    }
  }
); 