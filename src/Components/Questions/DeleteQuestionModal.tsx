import axios from "axios";
import React, { useState, useEffect } from "react";
import Loading from "../../Shared/Loading/Loading";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../types";

interface DeleteQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  getAllQuestions: () => void;
  id: string;
  questionTitle?: string; // Optional for better UX context
}

export default function DeleteQuestionModal({
  isOpen,
  onClose,
  getAllQuestions,
  id,
  questionTitle
}: DeleteQuestionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useSelector((state: RootState) => state.userData);
  const reqHeaders = `Bearer ${userData?.accessToken}`;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const deleteQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `https://upskilling-egypt.com:3005/api/question/${id}`,
        {
          headers: { Authorization: reqHeaders },
        }
      );
      
      toast.success(response?.data?.message || "Question deleted successfully");
      onClose();
      getAllQuestions();
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error deleting question";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-question-title"
      aria-describedby="delete-question-description"
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400 text-lg sm:text-xl"></i>
            </div>
            <div>
              <h3
                id="delete-question-title"
                className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white"
              >
                Delete Question
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loading />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Deleting question...</span>
            </div>
          ) : (
            <>
              {/* Warning Message */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-red-100 dark:bg-red-900/30 rounded-full mb-3">
                  <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400 text-lg sm:text-xl"></i>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Question
                </h4>
                <p 
                  id="delete-question-description"
                  className="text-sm text-gray-600 dark:text-gray-400 mb-3"
                >
                  Are you sure you want to permanently delete this question?
                </p>
                
                {/* Question Context (if available) */}
                {questionTitle && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Question to delete:</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {questionTitle}
                    </p>
                  </div>
                )}

                {/* Simple Warning */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-xs text-red-700 dark:text-red-300">
                    <i className="fa-solid fa-exclamation-triangle mr-1"></i>
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <i className="fa-solid fa-times mr-2"></i>
              Cancel
            </button>
            <button
              onClick={deleteQuestion}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <i className="fa-solid fa-trash-alt mr-2"></i>
              Delete Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
