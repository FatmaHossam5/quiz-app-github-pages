// Global TypeScript definitions for the Quiz App

// User and Authentication Types
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: {
    role: 'Student' | 'Instructor';
    avatar?: string;
  };
  group?: Group;
  avg_score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  userData: {
    accessToken: string;
    refreshToken: string;
    profile: User['profile'];
  } | null;
  headers: {
    headers: {
      Authorization: string | null;
    };
  };
  isAuthed: boolean;
}

// Quiz and Question Types
export interface Question {
  _id: string;
  title: string;
  description: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: 'A' | 'B' | 'C' | 'D';
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'MCQ' | 'True/False';
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  code: string;
  status: 'draft' | 'published' | 'completed';
  instructor: string;
  group: string;
  questions: Question[];
  questions_number: number;
  schedule: string;
  duration: number;
  score_per_question: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'MCQ' | 'True/False';
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Group Types
export interface Group {
  _id: string;
  name: string;
  students: User[];
  max_students: number;
  createdAt: string;
  updatedAt: string;
}

// Form and Component Types
export interface FormData {
  [key: string]: any;
}

export interface QuizFormData {
  title: string;
  description: string;
  group: string;
  questions_number: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'MCQ' | 'True/False';
  schedule: string;
  duration: number;
  score_per_question: number;
  category: string;
}

export interface QuestionFormData {
  title: string;
  description: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: 'A' | 'B' | 'C' | 'D';
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'MCQ' | 'True/False';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Redux Store Types
export interface RootState {
  userData: AuthState;
  incomingQuizzes: {
    incomingQuizzes: Quiz[] | null;
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
  };
  CompletedQuizzes: {
    completedQuizzes: Quiz[] | null;
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
  };
  groups: {
    groups: Group[];
    loading: boolean;
    error: string | null;
  };
  students: {
    students: User[];
    loading: boolean;
    error: string | null;
  };
}

// Component Props Types
export interface ModalProps {
  show: boolean;
  title?: string;
  onClose: () => void;
  onSave?: () => void;
  body?: React.ReactNode;
  omitHeader?: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  userData: AuthState['userData'];
}

// Utility Types
export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Student Quiz Submission
export interface Submission {
  question: string;
  answer: string;
}

export interface QuizResult {
  quiz: string;
  student: string;
  score: number;
  answers: Submission[];
  submittedAt: string;
} 
