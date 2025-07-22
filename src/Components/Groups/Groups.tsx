import DeleteGroup from "./DeleteGroup";
import AddGroup from "./AddGroup";
import UpdateGroup from "./UpdateGroup";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Loading from "../../Shared/Loading/Loading";
import { baseUrl } from "../../ApiUtils/ApiUtils";
import NoData from "../../Shared/NoData/NoData";
import { toast } from "react-toastify";
import { RootState, Group } from "../../types";

export default function Groups() {
  const [groupsList, setGroupsList] = useState<Group[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const { headers } = useSelector((state: RootState) => state.userData);

  //******** const modals add,update,delete*******//
  const [modalState, setModalState] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | number | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState<string>("");

  const handleAddModal = () => {
    setModalState("add");
    setIsOpen(true);
  };

  const handleUpdateModal = (group: Group) => {
    setModalState("update");
    setGroup(group);
    setIsOpen(true);
  };

  const handleDeleteModal = (group: Group) => {
    setModalState("delete");
    setId(group._id);
    setGroupName(group.name);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setModalState("");
    setGroup(null);
    setId(null);
    setGroupName("");
  };

  //*****to get all groups******* */
  const getGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/group`, headers);
      setGroupsList(response.data);
    } catch (error: unknown) {
      console.log(error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch groups";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Groups Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your student groups and assignments
            </p>
          </div>
          
          <button
            onClick={handleAddModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
            aria-label="Add new group"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Group
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Groups List Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Groups List
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {groupsList.length} {groupsList.length === 1 ? 'Group' : 'Groups'}
              </span>
            </div>
          </div>

          {/* Groups Content */}
          <div className="p-6">
            {isloading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-4">
                    <Loading />
                  </div>
                  <p className="text-gray-500">Loading groups...</p>
                </div>
              </div>
            ) : groupsList.length === 0 ? (
              <div className="py-8">
                <NoData />
                <div className="text-center mt-4">
                  <p className="text-gray-500 mb-4">No groups found</p>
                  <button
                    onClick={handleAddModal}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create your first group
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupsList.map((group: Group) => (
                  <div 
                    key={group?._id} 
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 hover:border-gray-300"
                  >
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {group?.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {group?.students?.length || 0} students
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleUpdateModal(group)}
                          className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          aria-label={`Edit ${group?.name}`}
                          title="Edit group"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDeleteModal(group)}
                          className="inline-flex items-center p-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          aria-label={`Delete ${group?.name}`}
                          title="Delete group"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Group Details */}
                    <div className="border-t border-gray-100 pt-4">
                     
                      {group?.students?.length > 0 && (
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalState === "add" && (
        <AddGroup
          getGroups={getGroups}
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}

      {modalState === "update" && group && (
        <UpdateGroup
          getGroups={getGroups}
          isOpen={isOpen}
          onClose={handleCloseModal}
          group={group}
        />
      )}

      {modalState === "delete" && id && (
        <DeleteGroup
          getGroups={getGroups}
          isOpen={isOpen}
          onClose={handleCloseModal}
          id={id}
          groupName={groupName}
        />
      )}
    </div>
  );
}
