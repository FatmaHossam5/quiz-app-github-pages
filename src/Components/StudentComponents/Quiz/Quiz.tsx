import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { baseUrl } from "../../../ApiUtils/ApiUtils";
import { RootState } from "../../../Redux/Store";
import ErrorMessage from "../../../Shared/ErrorMessage/ErrorMessage";
import Loading from "../../../Shared/Loading/Loading";
import SharedModal from "../../../Shared/Modal/Modal";
import CompletedQuizzes from "../../Quizzes/CompletedQuizzes/CompletedQuizzes";
import IncomingQuizzes from "../../Quizzes/IncomingQuizzes/IncomingQuizzes";

export default function Quiz() {
  const [modalState, setModalState] = useState("close");
  const { headers } = useSelector((state: RootState) => state.userData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const { incomingQuizzes, loading, error } = useSelector(
    (state: RootState) => state.incomingQuizzes
  );
  const { completedQuizzes } = useSelector(
    (state: RootState) => state.CompletedQuizzes
  );
  
  const showAddModal = () => {
    setModalState("add1");
  };
  
  const showSuccessJoinModal = () => {
    setModalState("success");
  };
  
  const handleClose = () => {
    setModalState("close");
  };
  
  const [isLoading, setIsLoading] = useState(false);
  
  const joinQuiz = (data: any) => {
    setIsLoading(true);
    axios
      .post(`${baseUrl}/quiz/join`, data, headers)
      .then((response) => {
        showSuccessJoinModal();
        setTimeout(() => {
          navigate(`/student/questions/${response.data.data.quiz}`);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Quizzes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Join quizzes and track your progress
              </p>
            </div>
            <button
              onClick={showAddModal}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <i className="fa-solid fa-plus text-sm"></i>
              <span>Join Quiz</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fa-solid fa-exclamation-triangle text-red-500 mr-3"></i>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Quiz Content */}
        <div className="space-y-8">
          {/* Incoming Quizzes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Available Quizzes
              </h3>
              {incomingQuizzes && incomingQuizzes.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {incomingQuizzes.length} available
                </span>
              )}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-48 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3">
                    <Loading />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Loading quizzes...</p>
                </div>
              </div>
            ) : incomingQuizzes && incomingQuizzes.length > 0 ? (
              <IncomingQuizzes incomingQuizzes={incomingQuizzes} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fa-solid fa-calendar-plus text-gray-400 text-lg"></i>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No available quizzes</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Check back later for new quizzes</p>
                </div>
              </div>
            )}
          </div>

          {/* Completed Quizzes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Completed Quizzes
              </h3>
              {completedQuizzes && completedQuizzes.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {completedQuizzes.length} completed
                </span>
              )}
            </div>
            
            {completedQuizzes && completedQuizzes.length > 0 ? (
              <CompletedQuizzes completedQuizzes={completedQuizzes} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fa-solid fa-clipboard-check text-gray-400 text-lg"></i>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No completed quizzes
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                    Your completed quizzes will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Quiz Modal */}
      <SharedModal
        show={modalState === "add1"}
        title="Join Quiz"
        onSave={handleSubmit(joinQuiz)}
        onClose={handleClose}
        body={
          <div className="p-6 space-y-6">
            {/* Introduction Section */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-key text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enter Quiz Code
              </h3>
              <p className="text-gray-600 text-sm">
                Ask your instructor for the quiz code to join
              </p>
            </div>

            {/* Form Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quiz Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-hashtag text-gray-400"></i>
                  </div>
                  <input
                    {...register("code", { 
                      required: "Quiz code is required",
                      minLength: {
                        value: 3,
                        message: "Quiz code must be at least 3 characters"
                      }
                    })}
                    type="text"
                    placeholder="e.g., ABC123"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                {errors.code && (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <i className="fa-solid fa-exclamation-circle mr-2"></i>
                    {String(errors.code.message)}
                  </div>
                )}
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <i className="fa-solid fa-info-circle text-blue-600 dark:text-blue-400 mr-3 mt-0.5"></i>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">How to get a quiz code:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Ask your instructor for the quiz code</li>
                    <li>• Check your email for quiz invitations</li>
                    <li>• Look for announcements in your course</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* Success Modal */}
      <SharedModal
        show={modalState === "success"}
        title="Success!"
        onSave={() => {}}
        onClose={handleClose}
        modalType="success"
        body={
          <div className="p-6 text-center">
            {/* Success Animation */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <i className="fa-solid fa-check text-green-600 text-3xl"></i>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto -mt-8 animate-ping">
                <i className="fa-solid fa-check text-green-400 text-xl"></i>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quiz Joined Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're all set! Redirecting to your quiz...
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Preparing your quiz...</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
              >
                <i className="fa-solid fa-times mr-2"></i>
                Close
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                <i className="fa-solid fa-arrow-right mr-2"></i>
                Continue
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}
