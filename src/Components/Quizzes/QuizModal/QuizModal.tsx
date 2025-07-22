import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl } from "../../../ApiUtils/ApiUtils";
import { RootState, Group } from "../../../types";
import Loading from "../../../Shared/Loading/Loading";
import { quiz } from "../SpecificQuiz/SpecificQuiz";
import "./QuizModal.css";

interface QuizModalProp {
  quiz?: quiz;
  handleClose?: () => void;
  setModalState: React.Dispatch<React.SetStateAction<string>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

interface formData {
  title?: string;
  description?: string;
  group?: string;
  questions_number?: number;
  difficulty?: string;
  type?: string;
  date?: string;
  time?: string;
  duration?: string;
  schedule?: string;
  schadule?: string;
  score_per_question?: string;
  __v?: string;
  updatedAt?: string;
  status?: string;
  questions?: string;
  instructor?: string;
  createdAt?: string;
  code?: string;
  _id?: string;
}

export default function QuizModal({ setModalState, setCode, quiz, handleClose }: QuizModalProp) {
  const { groups } = useSelector((state: RootState) => state.groups);
  const { headers } = useSelector((state: RootState) => state.userData);
  const [isLoading, setIsLoading] = useState(false);

  const durationAndQuestionNumber: number[] = [
    1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,
  ];
  const difficulty: string[] = ["easy", "medium", "hard"];
  const score_per_question: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const category: string[] = [
    "FE",
    "BE",
    "Mobile application",
    "Flutter",
    "AI",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<formData>();

  useEffect(() => {
    if (quiz) {
      for (const key in quiz) {
        if (Object.prototype.hasOwnProperty.call(quiz, key)) {
          const value = (quiz as unknown as Record<string, unknown>)[key];
          if (typeof value === "string" || typeof value === "number") {
            setValue(key as keyof formData, value);
          }
        }
      }
    }
  }, [quiz, setValue]);

  const addQuiz = (data: formData) => {
    data.schadule = `${data.date}T${data.time}`;
    delete data.time;
    delete data.date;
    delete data.schedule;
    postData(data);
  };

  const postData = (data: formData) => {
    setIsLoading(true);
    axios
      .post(`${baseUrl}/quiz`, data, headers)
      .then((res) => {
        toast.success(res.data.message);
        setCode(res.data.data.code);
        setModalState("quiz-code");
      })
      .catch((err) => {
        toast.error(String(err.response.data.message));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateQuiz = (data: formData) => {
    setIsLoading(true);
    delete data._id;
    delete data.__v;
    delete data.updatedAt;
    delete data.time;
    delete data.status;
    delete data.questions;
    delete data.instructor;
    delete data.date;
    delete data.createdAt;
    delete data.code;
    delete data.questions_number;
    delete data.score_per_question;
    delete data.difficulty;
    delete data.type;

    updateData(data);
  };

  const updateData = (data: formData) => {
    axios
      .put(`${baseUrl}/quiz/${quiz?._id}`, data, headers)
      .then((res) => {
        toast.success(res.data.message);
        setCode(res.data.data.code);
        setModalState("quiz-code");
      })
      .catch((err) => {
        toast.error(String(err.response.data.message));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <Loading />
          </div>
          <p className="text-gray-600 font-medium">
            {!quiz ? "Creating quiz..." : "Updating quiz..."}
          </p>
        </div>
      </div>
    );
  }

  if (!groups) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <Loading />
          </div>
          <p className="text-gray-600 font-medium">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <form
        onSubmit={!quiz ? handleSubmit(addQuiz) : handleSubmit(updateQuiz)}
        id="quizModal"
        className="space-y-6"
      >




        {/* Basic Information Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <i className="fa-solid fa-info-circle text-gray-500 mr-2"></i>
            Basic Information
          </h4>
          
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Quiz Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Quiz title is required" })}
              id="title"
              type="text"
              placeholder="Enter quiz title"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-sm flex items-center">
                <i className="fa-solid fa-exclamation-circle mr-1"></i>
                {String(errors.title?.message)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              id="description"
              rows={3}
              placeholder="Enter quiz description"
              className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm flex items-center">
                <i className="fa-solid fa-exclamation-circle mr-1"></i>
                {String(errors.description?.message)}
              </p>
            )}
          </div>
        </div>

        {/* Quiz Configuration Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <i className="fa-solid fa-cog text-gray-500 mr-2"></i>
            Quiz Configuration
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <select
                {...register("duration", { required: "Duration is required" })}
                id="duration"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.duration ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select duration</option>
                {durationAndQuestionNumber.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} minutes
                  </option>
                ))}
              </select>
              {errors.duration && (
                <p className="text-red-600 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {String(errors.duration?.message)}
                </p>
              )}
            </div>

            {/* Number of Questions */}
            <div className="space-y-2">
              <label htmlFor="questions_number" className="block text-sm font-medium text-gray-700">
                Number of Questions <span className="text-red-500">*</span>
              </label>
              <select
                {...register("questions_number", {
                  required: "Number of questions is required",
                  valueAsNumber: true,
                })}
                id="questions_number"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.questions_number ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select number</option>
                {durationAndQuestionNumber.map((number) => (
                  <option key={number} value={number}>
                    {number} questions
                  </option>
                ))}
              </select>
              {errors.questions_number && (
                <p className="text-red-600 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {String(errors.questions_number?.message)}
                </p>
              )}
            </div>

            {/* Score per Question */}
            <div className="space-y-2">
              <label htmlFor="score_per_question" className="block text-sm font-medium text-gray-700">
                Score per Question <span className="text-red-500">*</span>
              </label>
              <select
                {...register("score_per_question", { required: "Score per question is required" })}
                id="score_per_question"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.score_per_question ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select score</option>
                {score_per_question.map((score) => (
                  <option key={score} value={score}>
                    {score} point{score > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              {errors.score_per_question && (
                <p className="text-red-600 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {String(errors.score_per_question?.message)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <i className="fa-solid fa-calendar-alt text-gray-500 mr-2"></i>
            Schedule
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register("date", { required: "Date is required" })}
                id="date"
                type="date"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.date ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="text-red-600 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {String(errors.date?.message)}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                {...register("time", { required: "Time is required" })}
                id="time"
                type="time"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.time ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.time && (
                <p className="text-red-600 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {String(errors.time?.message)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Settings Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center">
            <i className="fa-solid fa-sliders-h text-gray-500 mr-2"></i>
            Quiz Settings
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Difficulty */}
            <div className="space-y-2">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty Level <span className="text-red-500">*</span>
              </label>
              <select
                {...register("difficulty", { required: "Difficulty is required" })}
                id="difficulty"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.difficulty ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select difficulty</option>
                {difficulty.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
              {errors.difficulty && (
                <p className="text-red-600 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {String(errors.difficulty?.message)}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("type", { required: "Category is required" })}
                id="type"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.type ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                {category.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-600 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {String(errors.type?.message)}
                </p>
              )}
            </div>

            {/* Group */}
            <div className="space-y-2">
              <label htmlFor="group" className="block text-sm font-medium text-gray-700">
                Group <span className="text-red-500">*</span>
              </label>
              <select
                {...register("group", { required: "Group is required" })}
                id="group"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.group ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select group</option>
                {groups?.map((group: Group) => (
                  <option key={group._id} value={String(group._id)}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.group && (
                <p className="text-red-600 text-sm flex items-center">
                  <i className="fa-solid fa-exclamation-circle mr-1"></i>
                  {String(errors.group?.message)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <i className="fa-solid fa-save mr-2"></i>
            {!quiz ? "Create Quiz" : "Update Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
