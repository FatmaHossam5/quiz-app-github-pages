import React, { useEffect, useState, useCallback } from "react";
import { baseUrl } from "../../ApiUtils/ApiUtils";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Loading from "../../Shared/Loading/Loading";
import ErrorMessage from "../../Shared/ErrorMessage/ErrorMessage";
import Select from "react-select";
import SharedModal from "../../Shared/Modal/Modal";
import { RootState } from "../../types";

// Interfaces
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
  isCurrentMember?: boolean;
}

interface Group {
  _id: string;
  name: string;
  students: Student[];
}

interface UpdateGroupProps {
  getGroups: () => void;
  isOpen: boolean;
  onClose: () => void;
  group: Group;
}

interface FormData {
  name: string;
  students: Option[];
}

// React Select style types
interface SelectStyles {
  control: (provided: React.CSSProperties) => React.CSSProperties;
  menu: (provided: React.CSSProperties) => React.CSSProperties;
  menuPortal: (provided: React.CSSProperties) => React.CSSProperties;
  multiValue: (provided: React.CSSProperties, state: { data: Option }) => React.CSSProperties;
  multiValueLabel: (provided: React.CSSProperties, state: { data: Option }) => React.CSSProperties;
  multiValueRemove: (provided: React.CSSProperties, state: { data: Option }) => React.CSSProperties;
  option: (provided: React.CSSProperties, state: { isSelected: boolean; isFocused: boolean; data: Option }) => React.CSSProperties;
}

export default function UpdateGroup({ getGroups, isOpen, onClose, group }: UpdateGroupProps) {
  const { headers } = useSelector((state: RootState) => state.userData);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const getStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get students without group for dropdown options only
      const response = await axios.get(`${baseUrl}/student/without-group`, headers);
      const studentsWithoutGroup: Student[] = response.data;
      setStudentsList(studentsWithoutGroup);
    } catch (error: unknown) {
      toast.error("Failed to load students.");
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
  

  const studentOptions: Option[] = studentsList.map((student) => ({
    value: student._id,
    label: `${student.first_name} ${student.last_name}`,
    isCurrentMember: false,
  }));

useEffect(() => {
  if (group && isOpen) {
    setValue("name", group.name);

    // Fetch current group students from the group API
    const fetchCurrentGroupStudents = async () => {
      try {
        const groupResponse = await axios.get(`${baseUrl}/group/${group._id}`, headers);
        const fullGroupData = groupResponse.data;
        const currentGroupStudents = fullGroupData.students || [];

        if (currentGroupStudents.length > 0) {
          const selectedOptions: Option[] = currentGroupStudents.map((student: Student) => ({
            value: student._id,
            label: `${student.first_name} ${student.last_name} (Current member)`,
            isCurrentMember: true,
          }));

          setValue("students", selectedOptions);
        } else {
          setValue("students", []);
        }
      } catch (error) {
        console.error("Error fetching current group students:", error);
        setValue("students", []);
      }
    };

    fetchCurrentGroupStudents();
  }
}, [group, setValue, isOpen, headers]);


  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const studentIds = data.students.map(student => student.value);
      await axios.put(`${baseUrl}/group/${group._id}`, {
        name: data.name,
        students: studentIds
      }, headers);
      
      toast.success("Group updated successfully!");
      handleClose();
      getGroups();
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update group.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const selectStyles: SelectStyles = {
    control: (provided: React.CSSProperties) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem 0.75rem 0.75rem 0.375rem',
      borderLeft: 'none',
      minHeight: '42px',
      '&:hover': { borderColor: '#6366f1' },
      '&:focus': { borderColor: '#6366f1', boxShadow: '0 0 0 1px #6366f1' },
    }),
    menu: (provided: React.CSSProperties) => ({ ...provided, zIndex: 9999 }),
    menuPortal: (provided: React.CSSProperties) => ({ ...provided, zIndex: 9999 }),
    multiValue: (provided: React.CSSProperties, state: { data: Option }) => ({
      ...provided,
      backgroundColor: state.data.isCurrentMember ? '#dbeafe' : '#f3f4f6',
      borderRadius: '0.375rem',
      border: state.data.isCurrentMember ? '1px solid #3b82f6' : 'none',
    }),
    multiValueLabel: (provided: React.CSSProperties, state: { data: Option }) => ({
      ...provided,
      color: state.data.isCurrentMember ? '#1e40af' : '#374151',
      fontSize: '0.875rem',
      fontWeight: state.data.isCurrentMember ? '600' : '400',
    }),
    multiValueRemove: (provided: React.CSSProperties, state: { data: Option }) => ({
      ...provided,
      color: state.data.isCurrentMember ? '#3b82f6' : '#6b7280',
      '&:hover': { 
        backgroundColor: state.data.isCurrentMember ? '#ef4444' : '#ef4444', 
        color: 'white' 
      },
    }),
    option: (provided: React.CSSProperties, state: { isSelected: boolean; isFocused: boolean; data: Option }) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? (state.data.isCurrentMember ? '#dbeafe' : '#6366f1')
        : state.isFocused 
        ? '#f3f4f6' 
        : 'white',
      color: state.isSelected 
        ? (state.data.isCurrentMember ? '#1e40af' : 'white')
        : '#374151',
      fontWeight: state.data.isCurrentMember ? '600' : '400',
      '&:hover': {
        backgroundColor: state.data.isCurrentMember ? '#bfdbfe' : '#e5e7eb',
      },
    }),
  };

  const modalBody = (
    <div className="px-6 py-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
          <span className="ml-3 text-gray-600">Loading students...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <label htmlFor="groupName" className="block text-sm font-semibold text-gray-700">
              Group Name <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <div className="flex items-center px-4 py-2 bg-authImage border-r border-gray-300 min-w-[120px]">
                <i className="fa-solid fa-users text-gray-600 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">Name</span>
              </div>
              <input
                {...register("name", {
                  required: "Group name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                  maxLength: { value: 50, message: "Maximum 50 characters" },
                })}
                type="text"
                id="groupName"
                placeholder="Enter group name"
                className="flex-1 px-3 py-2 text-sm border-0 focus:ring-0 focus:outline-none"
              />
            </div>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          {/* Students Selection */}
          <div className="space-y-2">
            <label htmlFor="students" className="block text-sm font-semibold text-gray-700">
              Update Students
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <p className="text-xs text-gray-500">
                Select students for this group. Current members are highlighted in blue.
              </p>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-xs text-gray-500">Current member</span>
              </div>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <div className="flex items-center px-4 py-2 bg-authImage border-r border-gray-300 min-w-[120px]">
                <i className="fa-solid fa-user-group text-gray-600 mr-2"></i>
                <span className="text-sm font-medium text-gray-700">Students</span>
              </div>
              <div className="flex-1">
                <Controller
                  name="students"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      isMulti
                      placeholder={
                        isLoading
                          ? "Loading students..."
                          : studentOptions.length === 0
                          ? "No students available"
                          : "Select students..."
                      }
                      options={studentOptions}
                      value={value || []}
                      onChange={onChange}
                      styles={selectStyles}
                      isDisabled={isSubmitting || isLoading}
                      isLoading={isLoading}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  )}
                />
              </div>
            </div>
            {errors.students && <ErrorMessage>{errors.students.message}</ErrorMessage>}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-pen-to-square mr-2"></i>
                  Update Group
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <SharedModal
      show={isOpen}
      title="Update Group"
      onClose={handleClose}
      omitHeader={true}
      body={modalBody}
    />
  );
}
