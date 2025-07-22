import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl } from "../../ApiUtils/ApiUtils";
import Loading from "../../Shared/Loading/Loading";
import SharedModal from "../../Shared/Modal/Modal";
import NoData from "../../Shared/NoData/NoData";
import AddStudentToGroup from "./AddStudentToGroup/AddStudentToGroup";
import StudentCard from "../StudentCard/StudentCard";
import { RootState, Group } from "../../types";

export interface studentInfo {
  email: string;
  last_name: string;
  first_name: string;
  group: {
    name: string;
  };
  _id: string;
  avg_score?: string;
}

export default function Students() {
  const { headers } = useSelector((state: RootState) => state.userData);
  const [modalAction, setModalAction] = useState("close");
  const [userId, setUserId] = useState<string>("");
  const [groups, setGroup] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<string>();
  const [activeGroupId, setActiveGroupId] = useState<string>();
  const [students, setStudents] = useState<studentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = (action: string) => {
    setModalAction(action);
  };
  
  const closeModal = useCallback(() => setModalAction("close"), []);

  const getStudentsFromGroup = useCallback((id: string) => {
    axios
      .get(`${baseUrl}/group/${id}`, headers)
      .then((res) => {
        setStudents(res.data.students);
      })
      .catch((err) => {
        // Error fetching students
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [headers]);

  const getGroupById = useCallback((id: string) => {
    setActiveGroupId(id);
    setIsLoading(true);
    getStudentsFromGroup(id);
  }, [getStudentsFromGroup]);

  const [addModalLoading, setAddModalLoading] = useState(false);

  const addStudentToGroup = () => {
    setAddModalLoading(true);
    if (userId) {
      return handleAddStudent();
    } else {
      toast.error("in-valid name or this student is already in group");
      setAddModalLoading(false);
    }
  };

  const handleAddStudent = useCallback(() => {
    axios
      .get(`${baseUrl}/student/${userId}/${groupId}`, headers)
      .then((response) => {
        toast.success(response.data.message);
        closeModal();
        getGroupById(activeGroupId!);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setAddModalLoading(false);
      });
  }, [userId, groupId, headers, closeModal, getGroupById, activeGroupId]);

  const getGroups = useCallback(() => {
    axios
      .get(`${baseUrl}/group`, headers)
      .then((response) => {
        setGroup(response.data);
        if (!groupId) {
          setGroupId(response.data[0]?._id);
          getGroupById(response.data[0]?._id);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Invalid Data");
      });
  }, [headers, groupId, getGroupById]);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  return (
    <div className="min-h-screen bg-gray-50">
      {groups.length === 0 ? (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Students Management</h1>
            <p className="text-gray-600">Manage students across different groups</p>
          </div>

          {/* Action Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => handleOpenModal("add")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <i className="fa-solid fa-circle-plus mr-2"></i>
              Add Student to Group
            </button>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Group Navigation */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Group</h3>
              <div className="flex flex-wrap gap-3">
                {groups.map((group, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setGroupId(group._id);
                      getGroupById(group._id);
                    }}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${
                      group._id === activeGroupId
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Students Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Students List
                  {activeGroupId && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({students.length} students)
                    </span>
                  )}
                </h3>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loading />
                </div>
              ) : students.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                  {students.map((student: studentInfo, index: number) => (
                    <div key={index} className="relative">
                      <StudentCard 
                        activeGroupId={activeGroupId!} 
                        getGroupById={getGroupById} 
                        student={student} 
                        groups={groups}
                        getGroups={getGroups}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <NoData />
                    <p className="mt-4 text-gray-500">No students found in this group</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <SharedModal
        show={modalAction === "add"}
        title="Add New Student"
        onSave={() => {
          addStudentToGroup();
        }}
        onClose={closeModal}
        body={
          <>
            {modalAction === "add" ? (
              <AddStudentToGroup
                isLoading={addModalLoading}
                selectedStudentId={setUserId}
              />
            ) : (
              ""
            )}
          </>
        }
      />
    </div>
  );
}
