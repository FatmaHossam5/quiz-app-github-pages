import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Loading from "../../Shared/Loading/Loading";
import AddQuestionModal from "./AddQuestionModal";
import DeleteQuestionModal from "./DeleteQuestionModal";
import UpdateQuestionModal from "./UpdateQuestionModal";
import { RootState, Question } from "../../types";

export default function Questions() {
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [isloading, setIsLoading] = useState(false);

  //******** const modals add,update,delete*******//
  const [modalState, setModalState] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionTitle, setQuestionTitle] = useState<string>("");

  const handleAddModal = () => {
    setModalState("add");
    setIsOpen(true);
  };
  const handleUpdateModal = (question: Question) => {
    setModalState("update");
    setQuestion(question);
    setIsOpen(true);
  };
  const handleDeleteModal = (id: string, title: string) => {
    setModalState("delete");
    setId(id);
    setQuestionTitle(title);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const { userData } = useSelector((state: RootState) => state.userData);
  const reqHeaders = `Bearer ${userData?.accessToken}`;

  const getAllQuestions = useCallback(() => {
    setIsLoading(true);
    axios
      .get(`https://upskilling-egypt.com:3005/api/question`, {
        headers: { Authorization: reqHeaders },
      })
      .then((response) => {
        setQuestionsList(response?.data);
      })
      .catch((error: unknown) => {
        console.error("Error fetching questions:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [reqHeaders]);

  useEffect(() => {
    getAllQuestions();
  }, [getAllQuestions]);

  // Helper function to get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
              <p className="text-gray-600 mt-1">
                Manage and organize your quiz questions
              </p>
            </div>
            <button
              onClick={handleAddModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Add Question
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isloading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loading />
                <p className="text-gray-600 mt-4">Loading questions...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {!questionsList || questionsList.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <i className="fa-solid fa-inbox text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600 text-lg font-medium">No questions found</p>
                    <p className="text-gray-500 mt-1">Get started by adding your first question</p>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Question Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Right Answer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questionsList.map((question: Question, idx: number) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={question?.title}>
                            {question?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(question?.difficulty)}`}>
                            {question?.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {question?.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={question?.answer}>
                            {question?.answer}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleUpdateModal(question)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1 rounded-md hover:bg-blue-50"
                              title="Edit question"
                            >
                              <i className="fa-solid fa-pen-to-square text-lg"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteModal(question?._id, question?.title)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-150 p-1 rounded-md hover:bg-red-50"
                              title="Delete question"
                            >
                              <i className="fa-solid fa-trash-can text-lg"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {questionsList && questionsList.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <i className="fa-solid fa-list mr-2 text-blue-500"></i>
                <span>Total Questions: <span className="font-semibold text-gray-900">{questionsList.length}</span></span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-chart-bar mr-2 text-green-500"></i>
                <span>Categories: <span className="font-semibold text-gray-900">
                  {new Set(questionsList.map((q: Question) => q.type)).size}
                </span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalState === "add" && (
        <AddQuestionModal
          getAllQuestions={getAllQuestions}
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}
      {modalState === "update" && (
        <UpdateQuestionModal
          getAllQuestions={getAllQuestions}
          isOpen={isOpen}
          onClose={handleCloseModal}
          question={question}
        />
      )}
      {modalState === "delete" && id && (
        <DeleteQuestionModal
          getAllQuestions={getAllQuestions}
          isOpen={isOpen}
          onClose={handleCloseModal}
          id={id}
          questionTitle={questionTitle}
        />
      )}
    </div>
  );
}
