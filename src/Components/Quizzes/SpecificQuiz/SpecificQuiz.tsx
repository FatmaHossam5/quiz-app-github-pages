import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getData } from "../../../ApiUtils/ApiUtils";
import SharedModal from "../../../Shared/Modal/Modal";
import Label from "../../../Shared/Label/Label";
import Loading from "../../../Shared/Loading/Loading";
import CodeModal from "../CodeModal/CodeModal";
import QuizModal from "../QuizModal/QuizModal";
import { normalizeQuizData } from "../../../utils/quizDataNormalizer";
import { RootState } from "../../../types";

export interface quiz {
  _id: string;
  title: string;
  schedule: string;
  duration: string;
  questions_number: string;
  score_per_question: string;
  description: string;
  type: string;
}

export default function SpacificQuiz() {
  const { quizId } = useParams();
  const { headers } = useSelector((state: RootState) => state.userData);
  const [quiz, setQuiz] = useState<quiz>();
  
  useEffect(() => {
    getData({ 
      path: `quiz/${quizId}`, 
      headers, 
      setState: (data: unknown) => {
        // Normalize the quiz data to handle field name mismatches
        const normalizedQuiz = normalizeQuizData(data);
        setQuiz(normalizedQuiz);
      }
    });
  }, [headers, quizId]);

  const [modalState, setModalState] = useState("close");
  const [code, setCode] = useState<string>("");
  const handleClose = () => {
    setModalState("close");
  };
  const openUpdateModal = () => {
    setModalState("update");
  };

  return (
    <>
      {quiz ? (
        <div className="quiz-name">
          <Link to="/dashboard/quizzes" className="m-2 font-semibold">
            Quizzes <i className="fa-solid fa-angle-right text-secondry"></i>
            <i className="fa-solid fa-angle-right text-secondry"></i>
          </Link>
          <span>{quiz?.title}</span>

          <div className="grid lg:grid-cols-3 grid-cols-1">
            <div className="content my-4 mx-2">
              <div className="header border-2 p-3 rounded-xl">
                <h2 className="text-2xl font-bold">{quiz?.title}</h2>
                <div className="flex my-3">
                  <p>
                    <i className="fa-solid fa-calendar-days mr-1"></i>
                    {quiz.schedule?.split("T")[0]}
                  </p>
                  <p>
                    <i className="fa-solid fa-clock mx-1"></i>
                    {quiz.schedule?.split("T")[1].split(".")[0]}
                  </p>
                </div>
                <Label word="Duration" value={quiz?.duration} />
                <Label
                  word="Number of questions"
                  value={quiz?.questions_number}
                />
                <Label
                  word="Score per question"
                  value={quiz?.score_per_question}
                />
                <Label
                  word="Description"
                  class_Name="grid-cols-1"
                  textClassName="text-sm"
                  value={quiz?.description}
                />
                <Label word="Question bank used" value={quiz?.type} />
                <div className="flex items-center">
                  <input
                    id="link-checkbox"
                    type="checkbox"
                    className="w-5 h-5 rounded accent-black"
                  />
                  <label
                    htmlFor="link-checkbox"
                    className="ms-2 text-sm font-medium text-gray-900"
                  >
                    Randomize questions.
                  </label>
                </div>
                <div className="text-end">
                  <button
                    onClick={openUpdateModal}
                    className="bg-zinc-900 hover:bg-zinc-700 text-white rounded-lg px-3 py-1 text-sm font-bold my-2"
                  >
                    <i className="fa-solid fa-pen text-white mx-1"></i>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-1/2 flex items-center justify-center w-full text-6xl">
          <Loading />
        </div>
      )}

      <SharedModal
        show={modalState === "update"}
        title="Edit Quiz"
        description="Update the quiz details below"
        customIcon="fa-solid fa-file-circle-plus text-blue-600"
        onSave={() => {
          () => {};
        }}
        onClose={handleClose}
        body={
          modalState == "update" ? (
            <QuizModal
              quiz={quiz}
              setCode={setCode}
              setModalState={setModalState}
              handleClose={handleClose}
            />
          ) : (
            ""
          )
        }
      />
      <SharedModal
        show={modalState === "quiz-code"}
        title=""
        onSave={() => {
          // Save action
        }}
        omitHeader={true}
        onClose={handleClose}
        body={<CodeModal handleClose={handleClose} code={code} />}
      />
    </>
  );
}
