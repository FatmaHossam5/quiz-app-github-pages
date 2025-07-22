import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";

// Error handling system
import { ErrorProvider } from "./context/ErrorContext";
import { RouteErrorBoundary } from "./Components/ErrorBoundary/SpecializedErrorBoundaries";
import "./services/globalErrorHandler"; // Initialize global error handler

// Layouts and components
import Loading from "./Shared/Loading/Loading";
import AuthLayout from "./Shared/AuthLayout/AuthLayout";
import MasterLayout from "./Shared/MasterLayout/MasterLayout";
import NotFound from "./Shared/NotFound/NotFound";
import ProtectedRoute from "./Shared/ProtectedRoute/ProtectedRoute";
import ProtectedRouteForStudent from "./Shared/ProtectedRouteForStudent/ProtectedRouteForStudent";
import StudentLayout from "./Shared/StudentLayout/StudentLayout";

// Lazy load components for better performance
const ChangePassword = React.lazy(() => import("./Components/ChangePassword/ChangePassword"));
const Groups = React.lazy(() => import("./Components/Groups/Groups"));
const Home = React.lazy(() => import("./Components/Home/Home"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const Questions = React.lazy(() => import("./Components/Questions/Questions"));
const Quizzes = React.lazy(() => import("./Components/Quizzes/Quizzes"));
const SpecificQuiz = React.lazy(() => import("./Components/Quizzes/SpecificQuiz/SpecificQuiz"));
const Register = React.lazy(() => import("./Components/Register/Register"));
const RequestResetPass = React.lazy(() => import("./Components/RequestResetPass/RequestResetPass"));
const RestPassword = React.lazy(() => import("./Components/RestPassword/RestPassword"));
const Results = React.lazy(() => import("./Components/Results/Results"));
const QuizResultDetails = React.lazy(() => import("./Components/Results/QuizResultDetails"));
const Quiz = React.lazy(() => import("./Components/StudentComponents/Quiz/Quiz"));
const StudentsQuestion = React.lazy(() => import("./Components/StudentComponents/Student'sQuestion/StudentsQuestion"));
const Students = React.lazy(() => import("./Components/Students/Students"));

// Suspense fallback component
const SuspenseFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <Loading />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Higher-order component for wrapping lazy components with error boundaries
const withRouteErrorBoundary = (Component: React.ComponentType, routeName: string) => {
  return (props: any) => (
    <RouteErrorBoundary routeName={routeName}>
      <Suspense fallback={<SuspenseFallback />}>
        <Component {...props} />
      </Suspense>
    </RouteErrorBoundary>
  );
};

function App() {
  const { userData } = useSelector((state: any) => state.userData);

  const routes = createBrowserRouter([
    {
      path: "dashboard",
      element: (
        <ProtectedRoute userData={userData}>
          <RouteErrorBoundary routeName="Dashboard Layout">
            <MasterLayout />
          </RouteErrorBoundary>
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { 
          index: true, 
          element: withRouteErrorBoundary(Home, "Home")({}) 
        },
        { 
          path: "groups", 
          element: withRouteErrorBoundary(Groups, "Groups")({}) 
        },
        { 
          path: "student", 
          element: withRouteErrorBoundary(Students, "Students")({}) 
        },
        { 
          path: "quizzes", 
          element: withRouteErrorBoundary(Quizzes, "Quizzes")({}) 
        },
        { 
          path: ":quizId", 
          element: withRouteErrorBoundary(SpecificQuiz, "Specific Quiz")({}) 
        },
        { 
          path: "questions", 
          element: withRouteErrorBoundary(Questions, "Questions")({}) 
        },
        { 
          path: "results", 
          element: withRouteErrorBoundary(Results, "Results")({}) 
        },
        { 
          path: "results/:quizTitle", 
          element: withRouteErrorBoundary(QuizResultDetails, "Quiz Result Details")({}) 
        },

      ],
    },
    {
      path: "/",
      element: (
        <RouteErrorBoundary routeName="Auth Layout">
          <AuthLayout />
        </RouteErrorBoundary>
      ),
      errorElement: <NotFound />,
      children: [
        { 
          index: true, 
          element: withRouteErrorBoundary(Login, "Login")({}) 
        },
        { 
          path: "login", 
          element: withRouteErrorBoundary(Login, "Login")({}) 
        },
        { 
          path: "register", 
          element: withRouteErrorBoundary(Register, "Register")({}) 
        },
        { 
          path: "request-reset-password", 
          element: withRouteErrorBoundary(RequestResetPass, "Request Reset Password")({}) 
        },
        { 
          path: "reset-password", 
          element: withRouteErrorBoundary(RestPassword, "Reset Password")({}) 
        },
        { 
          path: "change-password", 
          element: withRouteErrorBoundary(ChangePassword, "Change Password")({}) 
        },
      ],
    },
    {
      path: "student",
      element: (
        <ProtectedRouteForStudent userData={userData}>
          <RouteErrorBoundary routeName="Student Layout">
            <StudentLayout />
          </RouteErrorBoundary>
        </ProtectedRouteForStudent>
      ),
      errorElement: <NotFound />,
      children: [
        { 
          index: true, 
          element: withRouteErrorBoundary(Quiz, "Student Quiz")({}) 
        },
        { 
          path: "results", 
          element: withRouteErrorBoundary(Results, "Student Results")({}) 
        },

        { 
          path: "quizzes", 
          element: withRouteErrorBoundary(Quiz, "Student Quizzes")({}) 
        },
        { 
          path: "questions/:quizId", 
          element: withRouteErrorBoundary(StudentsQuestion, "Student Questions")({}) 
        },
      ],
    },
  ]);

  return (
    <ErrorProvider
      initialConfig={{
        enableLogging: true,
        enableReporting: process.env.NODE_ENV === 'production',
        enableRetry: true,
        maxRetries: 3,
        retryDelay: 1000,
        showErrorDetails: process.env.NODE_ENV === 'development',
        logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
      }}
    >
      <RouteErrorBoundary routeName="App Root">
        <ToastContainer
          theme="colored"
          autoClose={2000}
          position="top-right"
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          limit={5}
          newestOnTop={true}
        />
        <RouterProvider router={routes} />
      </RouteErrorBoundary>
    </ErrorProvider>
  );
}

export default App;
