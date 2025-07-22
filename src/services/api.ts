import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Cookies } from 'typescript-cookie';
import { ApiResponse, ApiError, Quiz, Question, Group, QuizResult } from '../types';
import { normalizeQuizArray } from '../utils/quizDataNormalizer';

// Base API configuration
const BASE_URL = 'https://upskilling-egypt.com:3005/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const userData = Cookies.get('userData');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData as string);
        if (parsedData.accessToken) {
          config.headers.Authorization = `Bearer ${parsedData.accessToken}`;
        }
      } catch (error) {
        // Error parsing user data from cookies
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status || 500,
      data: error.response?.data,
    };

    if (error.response?.data && typeof error.response.data === 'object') {
      const errorData = error.response.data as Record<string, unknown>;
      apiError.message = (errorData.message as string) || apiError.message;
    }

    // Handle specific error cases
    switch (error.response?.status) {
      case 401:
        // Handle unauthorized - redirect to login
        Cookies.remove('userData');
        window.location.href = '/login';
        break;
      case 403:
        apiError.message = 'You do not have permission to perform this action';
        break;
      case 404:
        apiError.message = 'Resource not found';
        break;
      case 500:
        apiError.message = 'Internal server error. Please try again later.';
        break;
    }

    return Promise.reject(apiError);
  }
);

// Generic API service class
class ApiService {
  // GET request
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(endpoint, config);
      
      // Handle different possible response structures
      let finalData: unknown = response.data.data;
      
      // If data.data is not an array, check if response.data itself is an array
      if (!Array.isArray(finalData)) {
        if (Array.isArray(response.data)) {
          finalData = response.data;
        }
      }
      
      return finalData as T;
    } catch (error) {
      this.handleError(error as ApiError);
      throw error;
    }
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(endpoint, data, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as ApiError);
      throw error;
    }
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(endpoint, data, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as ApiError);
      throw error;
    }
  }

  // DELETE request
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(endpoint, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as ApiError);
      throw error;
    }
  }

  // Centralized error handling
  private handleError(error: ApiError): void {
    // Only show toast for user-facing errors
    if (error.status !== 401) {
      toast.error(error.message);
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Specific API service classes
export class AuthService {
  async login(credentials: { email: string; password: string }) {
    return apiService.post('/auth/login', credentials);
  }

  async register(userData: { first_name: string; last_name: string; email: string; password: string; role: string }) {
    return apiService.post('/auth/register', userData);
  }

  async forgotPassword(email: { email: string }) {
    return apiService.post('/auth/forgot-password', email);
  }

  async resetPassword(data: { email: string; seed: string; password: string }) {
    return apiService.post('/auth/reset-password', data);
  }

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    return apiService.post('/auth/change-password', data);
  }
}

export class QuizService extends ApiService {
  // Role-based quiz fetching methods - using the correct endpoint
  async getIncomingQuizzes(): Promise<Quiz[]> {
    const endpoint = '/quiz/incomming'; // This is the only endpoint you have
    
    try {
      const data = await this.get<Quiz[]>(endpoint);
      
      // Ensure we always return an array and normalize the data
      if (!Array.isArray(data)) {
        return [];
      }
      
      // Normalize the quiz data to handle field name mismatches
      const normalizedData = normalizeQuizArray(data as unknown as Record<string, unknown>[]);
      return normalizedData;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getCompletedQuizzes(): Promise<Quiz[]> {
    const endpoint = '/quiz/completed';
    try {
      const data = await this.get<Quiz[]>(endpoint);
      
      // Ensure we always return an array and normalize the data
      if (!Array.isArray(data)) {
        return [];
      }
      
      // Normalize the quiz data to handle field name mismatches
      const normalizedData = normalizeQuizArray(data as unknown as Record<string, unknown>[]);
      return normalizedData;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Remove legacy methods - they use wrong endpoints
  // async getUpcomingQuizzes(role: 'Student' | 'Instructor') {
  //   return apiService.get('/quiz');
  // }

  // async getCompletedQuizzesLegacy() {
  //   return apiService.get('/quiz');
  // }

  async createQuiz(quizData: Record<string, unknown>) {
    return this.post<Quiz>('/quiz', quizData);
  }

  async updateQuiz(id: string, quizData: Record<string, unknown>) {
    return this.put<Quiz>(`/quiz/${id}`, quizData);
  }

  async deleteQuiz(id: string) {
    return this.delete<{ message: string }>(`/quiz/${id}`);
  }

  async joinQuiz(code: { code: string }) {
    return this.post<{ message: string }>('/quiz/join', code);
  }

  async getQuizQuestions(quizId: string) {
    return this.get<Question[]>(`/quiz/without-answers/${quizId}`);
  }

  async submitQuiz(quizId: string, answers: { answers: unknown[] }) {
    return this.post<{ message: string }>(`/quiz/submit/${quizId}`, answers);
  }

  async getQuizResults() {
    return this.get<QuizResult[]>('/quiz/result');
  }
}

export class QuestionService extends ApiService {
  async getQuestions() {
    return this.get<Question[]>('/question');
  }

  async createQuestion(questionData: Record<string, unknown>) {
    return this.post<Question>('/question', questionData);
  }

  async updateQuestion(id: string, questionData: Record<string, unknown>) {
    return this.put<Question>(`/question/${id}`, questionData);
  }

  async deleteQuestion(id: string) {
    return this.delete<{ message: string }>(`/question/${id}`);
  }
}

export class GroupService extends ApiService {
  async getGroups() {
    return this.get<Group[]>('/group');
  }

  async createGroup(groupData: Record<string, unknown>) {
    return this.post<Group>('/group', groupData);
  }

  async updateGroup(id: string, groupData: Record<string, unknown>) {
    return this.put<Group>(`/group/${id}`, groupData);
  }

  async deleteGroup(id: string) {
    return this.delete<{ message: string }>(`/group/${id}`);
  }

  async getGroupById(id: string) {
    return this.get<Group>(`/group/${id}`);
  }
}

export class StudentService {
  async getStudents() {
    return apiService.get('/student');
  }

  async getTopStudents() {
    return apiService.get('/student/top-five');
  }

  async getStudentById(id: string) {
    return apiService.get(`/student/${id}`);
  }

  async updateStudent(id: string, groupId: string) {
    return apiService.put(`/student/${id}/${groupId}`, {});
  }

  async deleteStudent(studentId: string, groupId: string) {
    return apiService.delete(`/student/${studentId}/${groupId}`);
  }
}

// Export service instances
export const authService = new AuthService();
export const quizService = new QuizService();
export const questionService = new QuestionService();
export const groupService = new GroupService();
export const studentService = new StudentService(); 
