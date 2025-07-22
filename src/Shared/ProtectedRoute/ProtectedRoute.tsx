import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserData } from "../../Redux/Slices/AuthSlice/Interfaces";
import { useDispatch } from "react-redux";
import { setGroup } from "../../Redux/Slices/GroupSlice/GroupSlice";
import { fetchDataForSlice } from "../../ApiUtils/ApiUtils";
import { setStudents } from "../../Redux/Slices/StudentsSlice/StudentsSlice";
import { fetchAllQuizzes } from "../../Redux/Slices/QuizThunks";
import { AppDispatch } from "../../Redux/Store";

export interface ProtectedProp{
    children:ReactNode;
    userData:UserData
  }

export default function ProtectedRoute({userData,children}:ProtectedProp) {
  const checkRole :boolean = userData?.profile?.role =="Student"
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log('🔍 [ProtectedRoute] useEffect triggered');
    console.log('📊 [ProtectedRoute] userData:', userData);
    console.log('📊 [ProtectedRoute] checkRole:', checkRole);
    console.log('📊 [ProtectedRoute] userData?.accessToken:', userData?.accessToken);
    
    if (userData?.accessToken && !checkRole) {
      console.log('✅ [ProtectedRoute] Conditions met - dispatching fetchAllQuizzes for Instructor');
      // Use the new role-based quiz fetching for instructors
      dispatch(fetchAllQuizzes('Instructor'));
      
      const fetchGroups=(response:any)=>{dispatch(setGroup(response))}
      const fetchStudents=(response:any)=>{dispatch(setStudents(response))}
      
      fetchDataForSlice('group',fetchGroups);
      fetchDataForSlice('student/top-five',fetchStudents);
    } else {
      console.log('⚠️ [ProtectedRoute] Conditions not met - not dispatching fetchAllQuizzes');
    }
  }, [dispatch, userData, checkRole]);

  if (!userData?.accessToken || checkRole ) {
    return <Navigate to="/login"/>
  } else {
    return children
  }
}
