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
    if (userData?.accessToken && checkRole) {
      // Use the new role-based quiz fetching for students
      dispatch(fetchAllQuizzes('Student'));
    }
  }, [dispatch, userData, checkRole]);

  if (userData?.accessToken && checkRole) {
    return children
  } else {
    return <Navigate to="/login"/>
  }
}
