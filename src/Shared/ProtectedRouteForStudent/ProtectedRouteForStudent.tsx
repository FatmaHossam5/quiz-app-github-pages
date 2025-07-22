import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { fetchAllQuizzes } from '../../Redux/Slices/QuizThunks'
import { ProtectedProp } from '../ProtectedRoute/ProtectedRoute'
import { AppDispatch } from '../../Redux/Store'

export default function ProtectedRouteForStudent({userData,children}:ProtectedProp) {
  const checkRole :boolean=userData?.profile?.role=="Student"
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    console.log('🔍 [ProtectedRouteForStudent] useEffect triggered');
    console.log('📊 [ProtectedRouteForStudent] userData:', userData);
    console.log('📊 [ProtectedRouteForStudent] checkRole:', checkRole);
    console.log('📊 [ProtectedRouteForStudent] userData?.accessToken:', userData?.accessToken);
    
    if (userData?.accessToken && checkRole) {
      console.log('✅ [ProtectedRouteForStudent] Conditions met - dispatching fetchAllQuizzes for Student');
      // Use the new role-based quiz fetching for students
      dispatch(fetchAllQuizzes('Student'));
    } else {
      console.log('⚠️ [ProtectedRouteForStudent] Conditions not met - not dispatching fetchAllQuizzes');
    }
  }, [dispatch, userData, checkRole]);

  if (userData?.accessToken && checkRole) {
    return children
  } else {
    return <Navigate to="/login"/>
  }
}
