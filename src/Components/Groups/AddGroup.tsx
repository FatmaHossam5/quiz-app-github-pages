import React, { useEffect, useState, useCallback } from "react";
import { baseUrl } from "../../ApiUtils/ApiUtils";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { RootState } from "../../types";
import Loading from "../../Shared/Loading/Loading";
import ErrorMessage from "../../Shared/ErrorMessage/ErrorMessage";
import Select from "react-select";

// Define interfaces for better type safety
interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  group?: {
    name: string;
  };
}

interface Option {
  value: string;
  label: string;
}

interface AddGroupProps {
  getGroups: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
}

// Add validation state for students
interface ValidationErrors {
  students?: string;
}

// React Select style types
interface SelectStyles {
  control: (provided: React.CSSProperties) => React.CSSProperties;
  menu: (provided: React.CSSProperties) => React.CSSProperties;
  menuPortal: (provided: React.CSSProperties) => React.CSSProperties;
  multiValue: (provided: React.CSSProperties) => React.CSSProperties;
  multiValueLabel: (provided: React.CSSProperties) => React.CSSProperties;
  multiValueRemove: (provided: React.CSSProperties) => React.CSSProperties;
}

export default function AddGroup({ getGroups, isOpen, onClose }: AddGroupProps) {
  const { headers } = useSelector((state: RootState) => state.userData);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const getStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use the endpoint that returns only students without groups
      const response = await axios.get(`${baseUrl}/student/without-group`, headers);
      const studentsData = response.data;
      
      console.log("Students without groups received:", studentsData); // Debug log
      
      if (Array.isArray(studentsData) && studentsData.length > 0) {
        setStudentsList(studentsData);
      } else {
        toast.error("No students available without groups.");
        setStudentsList([]);
      }
    } catch (error: unknown) {
      console.error("Error fetching students without groups:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load students without groups. Please try again.";
      toast.error(errorMessage);
      setStudentsList([]);
    } finally {
      setIsLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    if (isOpen) {
      getStudents();
    }
  }, [isOpen, getStudents]);

  // Transform students list to select options
  const studentOptions: Option[] = studentsList
    .filter(student => student && student._id && student.first_name && student.last_name)
    .map((student) => ({
      value: student._id,
      label: `${student.first_name} ${student.last_name}`,
    }));

  console.log("Student options:", studentOptions); // Debug log

  // Simplified change handler - removed complex types
  const handleStudentChange = (selectedOptions: Option[] | null) => {
    const options = selectedOptions ? [...selectedOptions] : [];
    setSelectedStudents(options);
    
    // Clear validation error when students are selected
    if (options.length > 0 && validationErrors.students) {
      setValidationErrors(prev => ({ ...prev, students: undefined }));
    }
  };

  const onSubmit = async (data: FormData) => {
    // Validate students selection
    if (selectedStudents.length === 0) {
      setValidationErrors({ students: "Please select at least one student" });
      return;
    }
    
    setIsSubmitting(true);
    
    // Transform the data to match API expectations
    const submitData = {
      name: data.name,
      students: selectedStudents.map(student => student.value),
    };

    try {
      const response = await axios.post(`${baseUrl}/group`, submitData, headers);
      toast.success(response?.data?.message || "Group created successfully!");
      
      // Reset form and close modal
      reset();
      setSelectedStudents([]);
      setValidationErrors({});
      onClose();
      getGroups();
    } catch (error: unknown) {
      console.error("Error creating group:", error);
      toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom styles for react-select to match project design
  const selectStyles: SelectStyles = {
    control: (provided: React.CSSProperties) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem 0.75rem 0.75rem 0.375rem',
      borderLeft: 'none',
      minHeight: '42px',
      '&:hover': {
        borderColor: '#6366f1',
      },
      '&:focus': {
        borderColor: '#6366f1',
        boxShadow: '0 0 0 1px #6366f1',
      },
    }),
    menu: (provided: React.CSSProperties) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuPortal: (provided: React.CSSProperties) => ({
      ...provided,
      zIndex: 9999,
    }),
    multiValue: (provided: React.CSSProperties) => ({
      ...provided,
      backgroundColor: '#f3f4f6',
      borderRadius: '0.375rem',
    }),
    multiValueLabel: (provided: React.CSSProperties) => ({
      ...provided,
      color: '#374151',
      fontSize: '0.875rem',
    }),
    multiValueRemove: (provided: React.CSSProperties) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#ef4444',
        color: 'white',
      },
    }),
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
      aria-labelledby="add-group-title"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-users text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 id="add-group-title" className="text-lg font-semibold text-gray-900">
                Create New Group
              </h3>
              <p className="text-sm text-gray-500">
                Add students to create a new group
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <i className="fa-solid fa-xmark text-gray-400 hover:text-gray-600"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loading />
              <span className="ml-3 text-gray-600">Loading students...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Group Name Field */}
              <div className="space-y-2">
                <label htmlFor="groupName" className="block text-sm font-semibold text-gray-700">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                  <div className="flex items-center px-4 py-2 bg-authImage border-r border-gray-300 min-w-[120px]">
                    <i className="fa-solid fa-users text-gray-600 mr-2"></i>
                    <span className="text-sm font-medium text-gray-700">Name</span>
                  </div>
                  <input
                    {...register("name", {
                      required: "Group name is required",
                      minLength: {
                        value: 2,
                        message: "Group name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Group name cannot exceed 50 characters",
                      },
                    })}
                    type="text"
                    id="groupName"
                    placeholder="Enter group name"
                    className="flex-1 px-3 py-2 text-sm border-0 focus:ring-0 focus:outline-none"
                  />
                </div>
                {errors.name && (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
              </div>

              {/* Students Selection Field */}
              <div className="space-y-2">
                <label htmlFor="students" className="block text-sm font-semibold text-gray-700">
                  Add Students (Without Groups)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Select students who are not assigned to any group yet. You can select multiple students.
                </p>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:border-indigo-500">
                  <div className="flex items-center px-4 py-2 bg-authImage border-r border-gray-300 min-w-[120px]">
                    <i className="fa-solid fa-user-group text-gray-600 mr-2"></i>
                    <span className="text-sm font-medium text-gray-700">Students</span>
                  </div>
                  <div className="flex-1">
                    <Select
                      isMulti
                      placeholder={
                        isLoading 
                          ? "Loading students without groups..." 
                          : studentOptions.length === 0 
                            ? "No students available without groups" 
                            : "Select students without groups..."
                      }
                      options={studentOptions}
                      value={selectedStudents}
                      onChange={handleStudentChange}
                      styles={selectStyles}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      isDisabled={isSubmitting || isLoading}
                      isLoading={isLoading}
                      isClearable={true}
                      isSearchable={true}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>
                </div>
                {validationErrors.students && (
                  <ErrorMessage>{validationErrors.students}</ErrorMessage>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus mr-2"></i>
                      Create Group
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
