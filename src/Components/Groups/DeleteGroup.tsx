import axios from "axios";
import React, { useState } from "react";
import Loading from "../../Shared/Loading/Loading";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { baseUrl } from '../../ApiUtils/ApiUtils';

interface DeleteGroupProps {
  getGroups: () => void;
  isOpen: boolean;
  onClose: () => void;
  id: string | number;
  groupName?: string; // Optional prop for better UX
}

export default function DeleteGroup({ getGroups, isOpen, onClose, id, groupName }: DeleteGroupProps) {
  const { headers } = useSelector((state: any) => state.userData);
  const [isLoading, setIsLoading] = useState(false);

  const deleteGroup = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${baseUrl}/group/${id}`, headers);
      toast.success(response?.data?.message || "Group deleted successfully");
      onClose();
      getGroups();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error deleting group");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-group-title"
      aria-describedby="delete-group-description"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-red-600 dark:text-red-400 text-xl"></i>
            </div>
            <div>
              <h3
                id="delete-group-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                Delete Group
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loading />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Deleting group...
              </p>
            </div>
          ) : (
            <div>
              <p
                id="delete-group-description"
                className="text-gray-700 dark:text-gray-300 mb-2"
              >
                Are you sure you want to delete{" "}
                {groupName ? (
                  <span className="font-semibold text-gray-900 dark:text-white">
                    "{groupName}"
                  </span>
                ) : (
                  "this group"
                )}
                ?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All associated data will be permanently removed.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={deleteGroup}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <i className="fa-solid fa-trash mr-2"></i>
              Delete Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
