import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { baseUrl } from '../../../ApiUtils/ApiUtils';
import Loading from '../../../Shared/Loading/Loading';
import SharedModal from '../../../Shared/Modal/Modal';
import { useNavigate } from 'react-router-dom';

interface Question {
  _id: string;
  title: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface Submission {
  question: string;
  answer: string;
}

export default function StudentsQuestion() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizName, setQuizName] = useState<string>("");
  const { headers } = useSelector((state: any) => state.userData);
  const { register } = useForm();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState("close");

  const getQuestions = () => {
    setIsLoading(true);
    axios.get(`${baseUrl}/quiz/without-answers/${quizId}`, headers)
      .then((response) => {
        setQuestions(response.data.data.questions);
        setQuizName(response.data.data.title);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Failed to load quiz questions');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const submitAnswers = () => {
    if (answers.length === 0) {
      toast.warning('Please answer at least one question before submitting');
      return;
    }

    setIsSubmitting(true);
    axios.post(`${baseUrl}/quiz/submit/${quizId}`, { answers }, headers)
      .then((response) => {
        toast.success(response.data.data.message);
        showResultModal();
        setTimeout(() => {
          navigate(`/student`);
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Failed to submit answers');
        setTimeout(() => {
          navigate(`/student`);
        }, 2000);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSubmit = (questionId: string, selectedAnswer: string) => {
    const newSubmission: Submission = {
      question: questionId,
      answer: selectedAnswer,
    };
    const existingSubmissionIndex = answers.findIndex(submission => submission.question === questionId);

    if (existingSubmissionIndex !== -1) {
      setAnswers(prevAnswers => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingSubmissionIndex] = newSubmission;
        return updatedAnswers;
      });
    } else {
      setAnswers(prevAnswers => [...prevAnswers, newSubmission]);
    }
  };

  const showResultModal = () => {
    setModalState("score");
  };

  const handleClose = () => {
    setModalState("close");
  };

  const getProgressPercentage = () => {
    if (questions.length === 0) return 0;
    return Math.round((answers.length / questions.length) * 100);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz: {quizName || "Loading..."}</h1>
              <p className="text-gray-600 mt-1">Answer all questions to complete the quiz</p>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  Progress: {answers.length}/{questions.length}
                </p>
                <p className="text-xs text-gray-500">
                  {getProgressPercentage()}% Complete
                </p>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Container */}
        {!isLoading ? (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Question Header */}
                <div className="bg-authImage px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Question {index + 1}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {answers.find(a => a.question === question._id) ? (
                        <span className="flex items-center text-green-600">
                          <i className="fa-solid fa-check-circle mr-1"></i>
                          Answered
                        </span>
                      ) : (
                        <span className="flex items-center text-orange-600">
                          <i className="fa-solid fa-circle mr-1"></i>
                          Pending
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {question.title}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="p-6">
                  <div className="space-y-3">
                    {Object.entries(question.options).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-200 group"
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          name={`question_${question._id}`}
                          onChange={() => handleSubmit(question._id, value)}
                          checked={answers.find(a => a.question === question._id && a.answer === value) !== undefined}
                        />
                        <div className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-full mr-4 group-hover:border-blue-400 transition-colors duration-200">
                          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                            answers.find(a => a.question === question._id && a.answer === value) 
                              ? 'bg-blue-600 scale-100' 
                              : 'scale-0'
                          }`}></div>
                        </div>
                        <div className="flex items-center flex-1">
                          <span className="font-medium text-gray-700 mr-3 min-w-[20px]">
                            {key}.
                          </span>
                          <span className="text-gray-700 leading-relaxed">
                            {value}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {answers.length === questions.length 
                      ? "All questions answered! You can now submit your quiz."
                      : `${questions.length - answers.length} question(s) remaining`
                    }
                  </p>
                </div>
                
                <button
                  onClick={submitAnswers}
                  disabled={isSubmitting || answers.length === 0}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      Submit Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loading />
              <p className="mt-4 text-sm text-gray-500">Loading quiz questions...</p>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SharedModal
        show={modalState === "score"}
        title="Quiz Submitted"
        onSave={() => {}}
        omitHeader={true}
        onClose={handleClose}
        body={
          <div className="text-center p-6">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-circle-check text-3xl text-green-600"></i>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Quiz Submitted Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Your answers have been recorded. You'll be redirected to the dashboard shortly.
            </p>
            <button
              onClick={handleClose}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <i className="fa-solid fa-check mr-2"></i>
              Close
            </button>
          </div>
        }
      />
    </div>
  );
}
