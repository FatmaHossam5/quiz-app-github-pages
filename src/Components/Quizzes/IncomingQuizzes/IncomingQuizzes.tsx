import { useLocation } from "react-router-dom";
import QuizCard from "../QuizCard/QuizCard.tsx";
import { Quiz } from "../../../types/index.ts";

interface IncomingQuizzesProps {
  incomingQuizzes: Quiz[];
}

export default function IncomingQuizzes({ incomingQuizzes }: IncomingQuizzesProps) {
  const location = useLocation();
  

  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with better styling */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-calendar-days text-blue-600 text-sm"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Incoming Quizzes</h3>
          </div>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
            {incomingQuizzes?.length || 0} quizzes
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {incomingQuizzes && incomingQuizzes.length > 0 ? (
          <div className="space-y-4">
            {(location.pathname === "/dashboard/quizzes" || location.pathname === "/student" ? 
              incomingQuizzes.slice(0, 2) : 
              incomingQuizzes
            ).map((quiz: Quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                showActions={false}
                className="border border-gray-100 hover:border-blue-200 transition-colors duration-200"
              />
            ))}
            
            {/* Show more link if there are more quizzes */}
            {location.pathname === "/dashboard/quizzes" && incomingQuizzes.length > 2 && (
              <div className="text-center pt-4 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200">
                  View all {incomingQuizzes.length} incoming quizzes
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-calendar-xmark text-gray-400 text-xl"></i>
            </div>
            <p className="text-gray-500 text-lg font-medium">No incoming quizzes</p>
            <p className="text-gray-400 text-sm mt-1">Create a new quiz to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}


