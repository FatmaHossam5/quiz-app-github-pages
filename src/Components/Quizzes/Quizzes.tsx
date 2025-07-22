import { useState } from "react";
import SharedModal from "../../Shared/Modal/Modal";
import IncomingQuizzes from "./IncomingQuizzes/IncomingQuizzes";
import CodeModal from "./CodeModal/CodeModal";
import CompletedQuizzes from "./CompletedQuizzes/CompletedQuizzes";
import QuizModal from "./QuizModal/QuizModal";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../../Shared/Loading/Loading";
import "./Quizzes.css";
import { RootState } from "../../Redux/Store";

export default function Quizzes() {
  const { incomingQuizzes, loading, error } = useSelector((state: RootState) => state.incomingQuizzes);
  const { completedQuizzes } = useSelector((state: RootState) => state.CompletedQuizzes);
  
  console.log('🔍 [Quizzes Component] Component rendered');
  console.log('📊 [Quizzes Component] Redux state:', {
    incomingQuizzes,
    loading,
    error
  });
  console.log('📊 [Quizzes Component] incomingQuizzes type:', typeof incomingQuizzes);
  console.log('📊 [Quizzes Component] Is array:', Array.isArray(incomingQuizzes));
  console.log('📊 [Quizzes Component] Length:', Array.isArray(incomingQuizzes) ? incomingQuizzes.length : 'Not an array');
  console.log('📊 [Quizzes Component] Full incomingQuizzes data:', incomingQuizzes);

  const [modalState, setModalState] = useState("close");
  const [code, setCode] = useState<string>("");
  
  const handleClose = () => {
    setModalState("close");
  };
  
  const showAddModal = () => {
    setModalState("add");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Quizzes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and create quizzes for your students
            </p>
          </div>
          <button
            onClick={showAddModal}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <i className="fa-solid fa-plus text-sm"></i>
            <span>Create Quiz</span>
          </button>
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
        <div className="space-y-6">
          {loading ? (
            // Loading state
            <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <Loading />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading quizzes...</p>
              </div>
            </div>
          ) : (
            // Data loaded - show content
            <>
              <IncomingQuizzes incomingQuizzes={incomingQuizzes || []} />
              <CompletedQuizzes completedQuizzes={completedQuizzes || []}/>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <SharedModal
        show={modalState === "add"}
        title="Set up a new quiz"
        onSave={() => {
         ()=>{}
        }}
        onClose={handleClose}
        body={
          modalState =="add"?<QuizModal setCode={setCode} setModalState={setModalState} handleClose={handleClose}/>:""
        }
      />
      <SharedModal
        show={modalState === "quiz-code"}
        title=""
        onSave={() => {
          console.log("hello");
        }}
        omitHeader={true}
        onClose={handleClose}
        modalType="success"
        body={
          <CodeModal handleClose={handleClose} code={code}/>
        }
      />
    </div>
  );
}
