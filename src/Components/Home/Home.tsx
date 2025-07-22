import { useState } from "react";
import { useSelector } from "react-redux";
import useFetchData from "../../ApiUtils/useFetchData";
import SharedModal from "../../Shared/Modal/Modal";
import Loading from "../../Shared/Loading/Loading";
import NoData from "../../Shared/NoData/NoData";
import userImg from "../../assets/user img.png";
import IncomingQuizzes from "../Quizzes/IncomingQuizzes/IncomingQuizzes";
import StudentDataModal, { StudentDataModalProp } from "../Students/StudentDataModal/StudentDataModal";
import { RootState, User } from "../../types";

export default function Home() {
  const [modalAction, setModalAction] = useState("close");
  const { incomingQuizzes, loading, error } = useSelector(
    (state: RootState) => state.incomingQuizzes
  );
  
  
  const { students: topStudents } = useSelector((state: RootState) => state.students);
  const { fetchedData: studentInfo, getData, isLoading } = useFetchData();

  const getStudentById = (studentId: string) => {
    setModalAction("view");
    getData(`student/${studentId}`);
  };
  const closeModal = () => setModalAction("close");

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening today.</p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Incoming Quizzes Section - Takes 2/3 of the width on XL screens */}
            <div className="xl:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fa-solid fa-calendar-days text-blue-500 mr-3"></i>
                  Incoming Quizzes
                </h2>
                
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loading />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-red-500 mb-2">Error loading quizzes</p>
                      <p className="text-sm text-gray-500">{error}</p>
                    </div>
                  </div>
                ) : incomingQuizzes && incomingQuizzes.length > 0 ? (
                  <IncomingQuizzes incomingQuizzes={incomingQuizzes} />
                ) : (
                  <div className=" flex items-center justify-center">
                    <NoData />
                  </div>
                )}
              </div>
            </div>

            {/* Top Students Section - Takes 1/3 of the width on XL screens */}
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fa-solid fa-trophy text-yellow-500 mr-3"></i>
                  Top 5 Students
                </h2>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {!topStudents ? (
                    <div className="flex items-center justify-center h-64">
                      <Loading />
                    </div>
                  ) : topStudents.length > 0 ? (
                    topStudents.map((student: User, id: number) => (
                      <div key={id} className="group">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img 
                                src={userImg} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" 
                                alt={`${student.first_name} ${student.last_name}`}
                              />
                              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {id + 1}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                  {student.first_name} {student.last_name}
                                </h3>
                                <button
                                  onClick={() => getStudentById(student?._id)}
                                  className="text-gray-400 hover:text-blue-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                  aria-label="View student details"
                                >
                                  <i className="fa-solid fa-external-link text-sm"></i>
                                </button>
                              </div>
                              
                              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="inline-flex items-center">
                                  <i className="fa-solid fa-users text-xs mr-1"></i>
                                  {student.group?.name || 'No group'}
                                </span>
                              </div>
                              
                              <div className="mt-2 flex items-center">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${student.avg_score || 90}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {student.avg_score || 90}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-64 flex items-center justify-center">
                      <NoData />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      <SharedModal
        show={modalAction === "view"}
        onClose={closeModal}
        omitHeader={true}
        body={
          !isLoading ? (
            <StudentDataModal studentInfo={studentInfo as StudentDataModalProp['studentInfo']} />
          ) : (
            <div className="flex items-center justify-center h-52">
              <Loading />
            </div>
          )
        }
      />
    </>
  );
}
