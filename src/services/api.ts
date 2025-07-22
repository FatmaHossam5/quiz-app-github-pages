import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Cookies } from 'typescript-cookie';
import { ApiResponse, ApiError, Quiz } from '../types';
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
    console.log('🔍 [Axios Interceptor] Request interceptor called');
    console.log('📊 [Axios Interceptor] Request URL:', config.url);
    console.log('📊 [Axios Interceptor] Request method:', config.method);
    console.log('📊 [Axios Interceptor] Request headers:', config.headers);
    
    const userData = Cookies.get('userData');
    console.log('📊 [Axios Interceptor] User data from cookies:', userData ? 'Present' : 'Not present');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData as string);
        console.log('📊 [Axios Interceptor] Parsed user data:', parsedData);
        if (parsedData.accessToken) {
          config.headers.Authorization = `Bearer ${parsedData.accessToken}`;
          console.log('✅ [Axios Interceptor] Authorization header added');
        } else {
          console.log('⚠️ [Axios Interceptor] No access token found in user data');
        }
      } catch (error) {
        console.error('❌ [Axios Interceptor] Error parsing user data from cookies:', error);
      }
    } else {
      console.log('⚠️ [Axios Interceptor] No user data found in cookies');
    }
    
    console.log('📊 [Axios Interceptor] Final request config:', config);
    return config;
  },
  (error) => {
    console.error('❌ [Axios Interceptor] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ [Axios Interceptor] Response interceptor - Success');
    console.log('📊 [Axios Interceptor] Response URL:', response.config.url);
    console.log('📊 [Axios Interceptor] Response status:', response.status);
    console.log('📊 [Axios Interceptor] Response headers:', response.headers);
    console.log('📊 [Axios Interceptor] Response data:', response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ [Axios Interceptor] Response interceptor - Error');
    console.error('📊 [Axios Interceptor] Error URL:', error.config?.url);
    console.error('📊 [Axios Interceptor] Error status:', error.response?.status);
    console.error('📊 [Axios Interceptor] Error data:', error.response?.data);
    console.error('📊 [Axios Interceptor] Error message:', error.message);
    
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status || 500,
      data: error.response?.data,
    };

    if (error.response?.data && typeof error.response.data === 'object') {
      const errorData = error.response.data as any;
      apiError.message = errorData.message || apiError.message;
    }

    // Handle specific error cases
    switch (error.response?.status) {
      case 401:
        console.log('🔍 [Axios Interceptor] 401 Unauthorized - redirecting to login');
        // Handle unauthorized - redirect to login
        Cookies.remove('userData');
        window.location.href = '/login';
        break;
      case 403:
        console.log('🔍 [Axios Interceptor] 403 Forbidden');
        apiError.message = 'You do not have permission to perform this action';
        break;
      case 404:
        console.log('🔍 [Axios Interceptor] 404 Not Found');
        apiError.message = 'Resource not found';
        break;
      case 500:
        console.log('🔍 [Axios Interceptor] 500 Internal Server Error');
        apiError.message = 'Internal server error. Please try again later.';
        break;
    }

    console.error('📊 [Axios Interceptor] Final API error:', apiError);
    return Promise.reject(apiError);
  }
);

// Generic API service class
class ApiService {
  // GET request
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    console.log('🔍 [ApiService] GET request to:', endpoint);
    console.log('🔍 [ApiService] Full URL:', `${BASE_URL}${endpoint}`);
    console.log('🔍 [ApiService] Config:', config);
    
    try {
      console.log('🔍 [ApiService] Making HTTP request...');
      const response = await apiClient.get<ApiResponse<T>>(endpoint, config);
      console.log('✅ [ApiService] HTTP request successful');
      console.log('📊 [ApiService] Response status:', response.status);
      console.log('📊 [ApiService] Response headers:', response.headers);
      console.log('📊 [ApiService] Full response data:', response.data);
      console.log('📊 [ApiService] Response data type:', typeof response.data);
      console.log('📊 [ApiService] Response data keys:', Object.keys(response.data));
      console.log('📊 [ApiService] Extracted data:', response.data.data);
      console.log('📊 [ApiService] Data type:', typeof response.data.data);
      console.log('📊 [ApiService] Is array:', Array.isArray(response.data.data));
      console.log('📊 [ApiService] Data constructor:', response.data.data?.constructor?.name);
      console.log('📊 [ApiService] Data stringified:', JSON.stringify(response.data.data, null, 2));
      
      // Handle different possible response structures
      let finalData: any = response.data.data;
      
      // If data.data is not an array, check if response.data itself is an array
      if (!Array.isArray(finalData)) {
        console.log('⚠️ [ApiService] response.data.data is not an array, checking response.data');
        if (Array.isArray(response.data)) {
          console.log('✅ [ApiService] response.data is an array, using it directly');
          finalData = response.data;
        } else {
          console.log('❌ [ApiService] Neither response.data.data nor response.data is an array');
          console.log('📊 [ApiService] response.data structure:', response.data);
        }
      }
      
      console.log('📊 [ApiService] Final data to return:', finalData);
      console.log('📊 [ApiService] Final data type:', typeof finalData);
      console.log('📊 [ApiService] Final data is array:', Array.isArray(finalData));
      
      return finalData as T;
    } catch (error) {
      console.error('❌ [ApiService] HTTP request failed:', error);
      this.handleError(error as ApiError);
      throw error;
    }
  }

  // POST request
  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(endpoint, data, config);
      return response.data.data;
    } catch (error) {
      this.handleError(error as ApiError);
      throw error;
    }
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
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
    
    // Log error for debugging
    console.error('API Error:', error);
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

export class QuizService {
  // Role-based quiz fetching methods - using the correct endpoint
  async getIncomingQuizzes(): Promise<Quiz[]> {
    console.log('🔍 [QuizService] getIncomingQuizzes() called');
    const endpoint = '/quiz/incomming'; // This is the only endpoint you have
    console.log('🔍 [QuizService] Using endpoint:', endpoint);
    
    try {
      console.log('🔍 [QuizService] Making API request to:', `${BASE_URL}${endpoint}`);
      const data = await apiService.get<Quiz[]>(endpoint);
      console.log('✅ [QuizService] getIncomingQuizzes() successful');
      console.log('📊 [QuizService] Received data:', data);
      console.log('📊 [QuizService] Data type:', typeof data);
      console.log('📊 [QuizService] Data length:', Array.isArray(data) ? data.length : 'Not an array');
      console.log('📊 [QuizService] Data structure:', JSON.stringify(data, null, 2));
      
      // Ensure we always return an array and normalize the data
      if (!Array.isArray(data)) {
        console.log('⚠️ [QuizService] Data is not an array, converting to empty array');
        return [];
      }
      
      // Normalize the quiz data to handle field name mismatches
      const normalizedData = normalizeQuizArray(data);
      console.log('✅ [QuizService] Data normalized successfully');
      console.log('✅ [QuizService] Returning normalized array with', normalizedData.length, 'items');
      return normalizedData;
    } catch (error: any) {
      console.error('❌ [QuizService] getIncomingQuizzes() failed:', error);
      console.error('❌ [QuizService] Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
      throw error;
    }
  }

  async getCompletedQuizzes(role: 'Student' | 'Instructor'): Promise<Quiz[]> {
    const endpoint = '/quiz/completed';
    try {
      const data = await apiService.get<Quiz[]>(endpoint);
      
      // Ensure we always return an array and normalize the data
      if (!Array.isArray(data)) {
        console.log('⚠️ [QuizService] Completed quizzes data is not an array, converting to empty array');
        return [];
      }
      
      // Normalize the quiz data to handle field name mismatches
      const normalizedData = normalizeQuizArray(data);
      console.log('✅ [QuizService] Completed quizzes data normalized successfully');
      return normalizedData;
    } catch (error: any) {
      console.error('❌ [QuizService] getCompletedQuizzes() failed:', error);
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

  async createQuiz(quizData: any) {
    return apiService.post('/quiz', quizData);
  }

  async updateQuiz(id: string, quizData: any) {
    return apiService.put(`/quiz/${id}`, quizData);
  }

  async deleteQuiz(id: string) {
    return apiService.delete(`/quiz/${id}`);
  }

  async joinQuiz(code: { code: string }) {
    return apiService.post('/quiz/join', code);
  }

  async getQuizQuestions(quizId: string) {
    return apiService.get(`/quiz/without-answers/${quizId}`);
  }

  async submitQuiz(quizId: string, answers: { answers: any[] }) {
    return apiService.post(`/quiz/submit/${quizId}`, answers);
  }

  async getQuizResults() {
    return apiService.get('/quiz/result');
  }
}

export class QuestionService {
  async getQuestions() {
    return apiService.get('/question');
  }

  async createQuestion(questionData: any) {
    return apiService.post('/question', questionData);
  }

  async updateQuestion(id: string, questionData: any) {
    return apiService.put(`/question/${id}`, questionData);
  }

  async deleteQuestion(id: string) {
    return apiService.delete(`/question/${id}`);
  }
}

export class GroupService {
  async getGroups() {
    return apiService.get('/group');
  }

  async createGroup(groupData: any) {
    return apiService.post('/group', groupData);
  }

  async updateGroup(id: string, groupData: any) {
    return apiService.put(`/group/${id}`, groupData);
  }

  async deleteGroup(id: string) {
    return apiService.delete(`/group/${id}`);
  }

  async getGroupById(id: string) {
    return apiService.get(`/group/${id}`);
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
