import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/api';
import { setUserData } from '../Redux/Slices/AuthSlice/AuthSlice';
import { LoadingState, ApiError } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  seed: string;
  password: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoadingState('pending');
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      
      dispatch(setUserData(response));
      toast.success('Login successful!');
      
      // Navigate based on user role
      if (response.profile?.role === 'Student') {
        navigate('/student');
      } else {
        navigate('/dashboard');
      }
      
      setLoadingState('succeeded');
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      setLoadingState('failed');
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    setLoadingState('pending');
    setError(null);
    
    try {
      const response = await authService.register(userData);
      
      dispatch(setUserData(response));
      toast.success('Registration successful!');
      
      // Navigate based on user role
      if (response.profile?.role === 'Student') {
        navigate('/student');
      } else {
        navigate('/dashboard');
      }
      
      setLoadingState('succeeded');
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      setLoadingState('failed');
      throw error;
    }
  };

  const forgotPassword = async (emailData: ForgotPasswordData) => {
    setLoadingState('pending');
    setError(null);
    
    try {
      const response = await authService.forgotPassword(emailData);
      
      toast.success('Reset password email sent!');
      navigate('/reset-password');
      
      setLoadingState('succeeded');
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      setLoadingState('failed');
      throw error;
    }
  };

  const resetPassword = async (resetData: ResetPasswordData) => {
    setLoadingState('pending');
    setError(null);
    
    try {
      const response = await authService.resetPassword(resetData);
      
      toast.success('Password reset successful!');
      navigate('/login');
      
      setLoadingState('succeeded');
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      setLoadingState('failed');
      throw error;
    }
  };

  const changePassword = async (passwordData: ChangePasswordData) => {
    setLoadingState('pending');
    setError(null);
    
    try {
      const response = await authService.changePassword(passwordData);
      
      toast.success('Password changed successfully!');
      
      setLoadingState('succeeded');
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message);
      setLoadingState('failed');
      throw error;
    }
  };

  return {
    login,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    loading: loadingState === 'pending',
    error,
    isIdle: loadingState === 'idle',
    isLoading: loadingState === 'pending',
    isSuccess: loadingState === 'succeeded',
    isError: loadingState === 'failed',
  };
}; 
