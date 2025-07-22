import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { baseUrl } from "../../ApiUtils/ApiUtils";
import useFetchData from "../../ApiUtils/useFetchData";
import Label from "../../Shared/Label/Label";
import Loading from "../../Shared/Loading/Loading";
import SharedModal from "../../Shared/Modal/Modal";
import userImg from "../../assets/user img.png";
import { studentInfo } from "../Students/Students";
import { RootState, Group } from "../../types";

interface StudentCard {
  student: studentInfo;
  getGroups: () => void;
  activeGroupId: string;
  getGroupById: (id: string) => void;
  groups: Group[];
}

export default function StudentCard({
  student,
  getGroups,
  groups,
  activeGroupId,
  getGroupById
}: StudentCard) {
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const { headers } = useSelector((state: RootState) => state.userData);
  const [studentId, setStudentId] = useState<string>("close");
  const [modalState, setModalState] = useState<string>("close");
  const { fetchedData: studentData, getData, isLoading } = useFetchData();
  const [groupId, setGroupId] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  
  // Get the name of the active group
  const activeGroupName = groups.find(group => group._id === activeGroupId)?.name;
 
  
  const toggleDropdown = () => {
    if (!dropdownOpen) {
      // Check if dropdown would be cut off at bottom
      const buttonElement = dropdownRef.current?.querySelector('button');
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 120; // Approximate height of dropdown
        const spaceBelow = viewportHeight - rect.bottom;
        
        if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    }
    setDropdownOpen(!dropdownOpen);
  };
  
  const closeModal = () => {
    setModalState("close");
  };

  const handleView = (id: string) => {
    getUserInfo(id);
    setModalState("view");
  };
  
  const getUserInfo = (id: string) => {
    getData(`student/${id}`);
  };
  
  const handleEdit = (id: string) => {
    setStudentId(id);
    setModalState("Edit");
  };



  const handleUpdate = () => {
    if (!groupId) {
      toast.error("Please select a group to continue");
      return;
    }

    // Check if trying to assign to current group
    if (groupId === activeGroupId) {
      toast.warning("Student is already in this group");
      return;
    }
    
    axios
      .put(
        `https://upskilling-egypt.com:3005/api/student/${studentId}/${groupId}`, {}, headers
      )
      .then(() => {
        getGroupById(activeGroupId);
        toast.success(`Successfully moved ${student.first_name} to ${groups.find(g => g._id === groupId)?.name}`);
        closeModal();
        setGroupId(""); // Reset selection
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to update student group");
      });
  };

  const [loadingOfDeleteModal, setLoadingOfDeleteModal] = useState(false);
  
  const handleDelete = (id: string) => {
    setModalState("Delete");
    setStudentId(id);
  };

  const deleteStudent = () => {
    setLoadingOfDeleteModal(true)
    if (!studentId || !activeGroupId) return;
    axios
      .delete(`${baseUrl}/student/${studentId}/${activeGroupId}`, headers)
      .then((response) => {
        toast.success(response?.data?.message);
        getGroupById(activeGroupId)
        closeModal();
        getGroups();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      }).finally(() => {
        setLoadingOfDeleteModal(false)
      })
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 relative">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={userImg} 
                  alt={`${student.first_name} ${student.last_name}`} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {student.first_name} {student.last_name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <i className="fa-solid fa-user-graduate mr-1"></i>
                    Student
                  </span>
                  <span className="flex items-center">
                    <i className="fa-solid fa-circle text-green-500 mr-1"></i>
                    Active
                  </span>
                </div>
                {student.group && (
                  <p className="text-sm text-gray-600 mt-1">
                    <i className="fa-solid fa-users mr-1"></i>
                    {student.group.name}
                  </p>
                )}
              </div>
            </div>
            
            {/* Action Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Open menu"
              >
                <i className="fa-solid fa-ellipsis-vertical text-gray-400"></i>
              </button>
              
              {dropdownOpen && (
                <div className={`absolute right-0 w-48 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999] border border-gray-200 transform opacity-100 scale-100 transition-all duration-200 ease-out ${
                  dropdownPosition === 'bottom' 
                    ? 'top-full mt-1' 
                    : 'bottom-full mb-1'
                }`}>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleView(student._id);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <i className="fa-solid fa-eye mr-3 text-gray-400"></i>
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        handleEdit(student._id);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <i className="fa-solid fa-edit mr-3 text-gray-400"></i>
                      Update Group
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(student._id);
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <i className="fa-solid fa-trash-alt mr-3"></i>
                      Delete Student
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <SharedModal
        show={modalState === "view"}
        omitHeader={true}
        onClose={closeModal}
        body={
          !isLoading ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <img 
                  src={userImg} 
                  alt="Student" 
                  className="w-20 h-20 rounded-full mx-auto border-4 border-gray-200"
                />
                <h3 className="text-xl font-semibold text-gray-900 mt-3">
                  {studentData.first_name} {studentData.last_name}
                </h3>
              </div>
              <div className="space-y-3">
                <Label
                  word="First Name"
                  class_Name="w-full"
                  value={studentData.first_name}
                />
                <Label
                  word="Last Name"
                  class_Name="w-full"
                  value={studentData.last_name}
                />
                <Label
                  word="Email"
                  class_Name="w-full"
                  value={studentData.email}
                />
                <Label
                  word="Group"
                  class_Name="w-full"
                  value={studentData?.group?.name}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <Loading />
            </div>
          )
        }
      />

      {/* Delete Modal */}
      <SharedModal
        show={modalState === "Delete"}
        title="Delete Student"
        onClose={closeModal}
        modalType="delete"
        body={
          !loadingOfDeleteModal ? (
            <div className="p-6">
              {/* Student Info */}
              <div className="text-center mb-6">
                <img 
                  src={userImg} 
                  alt="Student" 
                  className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-gray-200"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {student.first_name} {student.last_name}
                </h3>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>

              {/* Warning Message */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
                  <i className="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <p className="text-gray-700 mb-3">
                  Are you sure you want to delete this student?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  This action cannot be undone.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteStudent}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mr-3"></div>
              <span className="text-gray-600">Deleting...</span>
            </div>
          )
        }
      />

      {/* Update Modal */}
      <SharedModal
        show={modalState === "Edit"}
        title="Update Student Group"
        onSave={handleUpdate}
        onClose={closeModal}
        body={
          <div className="p-6">
            {/* Student Information Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src={userImg} 
                  alt="Student" 
                  className="w-16 h-16 rounded-full border-3 border-gray-200 shadow-sm"
                />
                <div className="ml-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.first_name} {student.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
              
              {/* Current Group Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-users text-blue-600 mr-2"></i>
                                      <span className="text-sm font-medium text-blue-800">Current Group:</span>
                    <span className="text-sm text-blue-900 ml-2 font-semibold">
                      {activeGroupName || "No group assigned"}
                    </span>
                </div>
              </div>
            </div>

            {/* Group Selection Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fa-solid fa-arrow-right mr-2 text-indigo-600"></i>
                  Select New Group
                </label>
                
                {/* Enhanced Select Dropdown */}
                <div className="relative">
                  <select
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white text-gray-900 font-medium transition-all duration-200 ${
                      groupId ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    value={groupId}
                    onChange={(eventInfo) => {
                      setGroupId(eventInfo.target.value);
                    }}
                  >
                    <option value="" className="text-gray-500">Choose a group...</option>
                    {groups.map((group, idx) => (
                                             <option 
                         key={idx} 
                         value={group._id}
                         className="text-gray-900 py-2"
                         disabled={group.name === student.group?.name}
                       >
                         {group.name} {group.name === student.group?.name ? '(Current)' : ''}
                       </option>
                    ))}
                  </select>
                  
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                </div>

                {/* Validation Message */}
                {!groupId && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <i className="fa-solid fa-info-circle mr-1"></i>
                    Please select a group to continue
                  </p>
                )}

                {/* Selected Group Preview */}
                {groupId && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <i className="fa-solid fa-check-circle text-green-600 mr-3 text-lg"></i>
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Moving to: {groups.find(g => g._id === groupId)?.name}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Click "Update Group" to confirm the change
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Group Information Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {groups.slice(0, 4).map((group, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      groupId === group._id 
                        ? 'border-indigo-300 bg-indigo-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                         } ${group.name === student.group?.name ? 'opacity-50 cursor-not-allowed' : ''}`}
                     onClick={() => group.name !== student.group?.name && setGroupId(group._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {group.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {group.students?.length || 0} students
                        </p>
                      </div>
                                             {group.name === student.group?.name && (
                         <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                           Current
                         </span>
                       )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning Message */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <i className="fa-solid fa-exclamation-triangle text-yellow-600 mr-3 mt-0.5"></i>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Group Change Notice
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Changing a student's group will affect their quiz assignments and access to group-specific content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
