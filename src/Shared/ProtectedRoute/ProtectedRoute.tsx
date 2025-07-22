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
    if (userData?.accessToken && !checkRole) {
      // Use the new role-based quiz fetching for instructors
      dispatch(fetchAllQuizzes('Instructor'));
      
      const fetchGroups=(response: unknown)=>{dispatch(setGroup(response))}
      const fetchStudents=(response: unknown)=>{dispatch(setStudents(response))}
      
      fetchDataForSlice('group',fetchGroups);
      fetchDataForSlice('student/top-five',fetchStudents);
    }
  }, [dispatch, userData, checkRole]);

  if (!userData?.accessToken || checkRole ) {
    return <Navigate to="/login"/>
  } else {
    return children
  }
}
