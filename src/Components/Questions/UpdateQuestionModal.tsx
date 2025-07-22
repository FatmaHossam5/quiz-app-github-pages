import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from '../../Shared/Loading/Loading';
import SharedModal from "../../Shared/Modal/Modal";
import { RootState, Question } from "../../types";

interface UpdateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  getAllQuestions: () => void;
  question: Question;
}

interface QuestionFormData {
  title: string;
  description: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: 'A' | 'B' | 'C' | 'D';
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'FE' | 'BE' | 'FS';
}

export default function UpdateQuestionModal({ isOpen, onClose, getAllQuestions, question }: UpdateQuestionModalProps) {

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormData>();

  const { userData } = useSelector((state: RootState) => state.userData);
  const reqHeaders = `Bearer ${userData?.accessToken}`;

  useEffect(() => {
    setValue("title", question.title);
    setValue("description", question.description);
    setValue("options.A", question.options.A);
    setValue("options.B", question.options.B);
    setValue("options.C", question.options.C);
    setValue("options.D", question.options.D);
    setValue("answer", question.answer);
    setValue("difficulty", question.difficulty);
    setValue("type", question.type);
  }, [question, setValue])

  const onSubmit = (data: QuestionFormData) => {
    setIsLoading(true);
    axios
    .put(`https://upskilling-egypt.com:3005/api/question/${question._id}`, data, {
      headers: { Authorization: reqHeaders },
    })
    .then((response) => {
      toast.success(response?.data.message || "Question updated successfully");
      
    })
    .catch((error: unknown) => {
      console.log(error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error updating question";
      toast.error(errorMessage);
    })
    .finally(() => {
      setIsLoading(false);
      onClose()
      getAllQuestions()
      
    });
   
    
  };

  return (
    <SharedModal
      onClose={onClose}
      show={isOpen}
      omitHeader={true}
      body={
        isLoading ? (
          <div className="flex items-center justify-center h-64 p-6">
            <div className="text-center">
              <Loading />
              <p className="text-gray-600 mt-4">Updating question...</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Header */}
            <div className="border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Question
              </h3>
            </div>

            {/* Form Content */}
            <form id="update-question-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", {
                    required: "Question title is required",
                  })}
                  type="text"
                  placeholder="Enter the question title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(errors.title.message)}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description", {required:"Description is required"})}
                  rows={2}
                  placeholder="Enter question description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(errors.description.message)}
                  </p>
                )}
              </div>

              {/* Options Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <div key={option}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Option {option}
                      </label>
                      <input
                        {...register(`options.${option}`, {
                          required: `Option ${option} is required`,
                        })}
                        type="text"
                        placeholder={`Enter option ${option}`}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.options && (errors.options as Record<string, { message?: string }>)[option] && (
                        <p className="mt-1 text-xs text-red-600">
                          {String((errors.options as Record<string, { message?: string }>)[option]?.message)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Settings <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    {...register("answer", {
                      required: "Please select the correct answer",
                    })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Correct Answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  <select
                    {...register("difficulty", {
                      required: "Please select difficulty level",
                    })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <select
                    {...register("type", {
                      required: "Please select a category",
                    })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Category</option>
                    <option value="FE">Frontend</option>
                    <option value="BE">Backend</option>
                    <option value="FS">Full Stack</option>
                  </select>
                </div>
                {(errors.answer || errors.difficulty || errors.type) && (
                  <p className="mt-1 text-sm text-red-600">
                    All settings are required
                  </p>
                )}
              </div>
            </form>

            {/* Footer Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="update-question-form"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check mr-2"></i>
                    Update Question
                  </>
                )}
              </button>
            </div>
          </div>
        )
      }
    />
  )
}
