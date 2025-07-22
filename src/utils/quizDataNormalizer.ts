import { Quiz } from '../types';

/**
 * Normalizes quiz data to handle field name mismatches between frontend and backend
 * The backend uses 'schadule' (with typo) while frontend expects 'schedule'
 */
export const normalizeQuizData = (quiz: Record<string, unknown>): Quiz => {
  // Handle the schedule/schadule field name mismatch
  const normalizedQuiz = { ...quiz };
  
  // If the quiz has 'schadule' field (backend typo), copy it to 'schedule'
  if (quiz.schadule !== undefined && quiz.schedule === undefined) {
    normalizedQuiz.schedule = quiz.schadule;
  }
  
  // If the quiz has 'schedule' field (correct), use it
  if (quiz.schedule !== undefined) {
    normalizedQuiz.schedule = quiz.schedule;
  }
  
  return normalizedQuiz as unknown as Quiz;
};

/**
 * Normalizes an array of quiz data
 */
export const normalizeQuizArray = (quizzes: Record<string, unknown>[]): Quiz[] => {
  return quizzes.map(normalizeQuizData);
}; 