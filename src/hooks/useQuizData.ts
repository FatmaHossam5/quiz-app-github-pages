import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { quizService } from '../services/api';
import { Quiz } from '../types';
import { RootState } from '../types';

interface UseQuizDataReturn {
  incomingQuizzes: Quiz[] | null;
  completedQuizzes: Quiz[] | null;
  isLoading: boolean;
  error: string | null;
  refetchIncoming: () => Promise<void>;
  refetchCompleted: () => Promise<void>;
  refetchAll: () => Promise<void>;
}

export const useQuizData = (): UseQuizDataReturn => {
  const [incomingQuizzes, setIncomingQuizzes] = useState<Quiz[] | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<Quiz[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userData = useSelector((state: RootState) => state.userData.userData);
  const userRole = userData?.profile?.role as 'Student' | 'Instructor';

  const fetchIncomingQuizzes = useCallback(async () => {
    if (!userRole) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await quizService.getIncomingQuizzes(userRole);
      setIncomingQuizzes(data);
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string })?.message || 'Failed to fetch incoming quizzes';
      setError(errorMessage);
      console.error('Error fetching incoming quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userRole]);

  const fetchCompletedQuizzes = useCallback(async () => {
    if (!userRole) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await quizService.getCompletedQuizzes(userRole);
      setCompletedQuizzes(data);
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string })?.message || 'Failed to fetch completed quizzes';
      setError(errorMessage);
      console.error('Error fetching completed quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userRole]);

  const refetchIncoming = useCallback(async () => {
    await fetchIncomingQuizzes();
  }, [fetchIncomingQuizzes]);

  const refetchCompleted = useCallback(async () => {
    await fetchCompletedQuizzes();
  }, [fetchCompletedQuizzes]);

  const refetchAll = useCallback(async () => {
    await Promise.all([fetchIncomingQuizzes(), fetchCompletedQuizzes()]);
  }, [fetchIncomingQuizzes, fetchCompletedQuizzes]);

  // Initial data fetch
  useEffect(() => {
    if (userRole) {
      refetchAll();
    }
  }, [userRole, refetchAll]);

  return {
    incomingQuizzes,
    completedQuizzes,
    isLoading,
    error,
    refetchIncoming,
    refetchCompleted,
    refetchAll,
  };
}; 