import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slices/AuthSlice/AuthSlice";
import incomingQuizzesReducer from "./Slices/incomingQuizzesSlice/incomingQuizzesSlice";
import completedQuizzesReducer from "./Slices/CompletedQuizzes/CompletedQuizzes";
import groupReducer from "./Slices/GroupSlice/GroupSlice";
import StudentsSlice from "./Slices/StudentsSlice/StudentsSlice";

const store = configureStore({
  reducer: {
    userData: authReducer,
    incomingQuizzes: incomingQuizzesReducer,
    CompletedQuizzes: completedQuizzesReducer,
    groups: groupReducer,
    students: StudentsSlice
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
