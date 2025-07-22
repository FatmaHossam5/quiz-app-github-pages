import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { baseUrl } from '../../../ApiUtils/ApiUtils';
import Input from '../../../Shared/Input/Input';
import Loading from '../../../Shared/Loading/Loading';
import { RootState } from '../../../types';

interface AddStudentInterface {
  selectedStudentId: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function AddStudentToGroup({ selectedStudentId, isLoading }: AddStudentInterface) {
  const [studentsWithoutGroup, setStudentsWithoutGroup] = useState<Student[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { headers } = useSelector((state: RootState) => state.userData);

  const getStudentsWithoutGroup = useCallback(() => {
    axios.get(`${baseUrl}/student/without-group`, headers)
      .then((response) => {
        setStudentsWithoutGroup(response.data);
        setFilteredStudents(response.data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Failed to fetch students');
      });
  }, [headers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNameInput(inputValue);
    setSelectedIndex(-1); // Reset selection when typing
    
    if (inputValue.trim() === '') {
      setFilteredStudents([]);
      setShowDropdown(false);
      selectedStudentId('');
      return;
    }

    const filtered = studentsWithoutGroup.filter(student => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const email = student.email.toLowerCase();
      const searchTerm = inputValue.toLowerCase();
      
      return fullName.includes(searchTerm) || email.includes(searchTerm);
    });

    setFilteredStudents(filtered);
    setShowDropdown(filtered.length > 0);
    
    // Don't auto-select - let user choose explicitly
    selectedStudentId('');
  };

  const handleStudentSelect = (student: Student) => {
    setNameInput(`${student.first_name} ${student.last_name}`);
    selectedStudentId(student._id);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredStudents.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredStudents.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredStudents.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredStudents.length) {
          handleStudentSelect(filteredStudents[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    // Only show dropdown if there's a search term and results
    if (nameInput.trim() !== '' && filteredStudents.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }, 200);
  };

  useEffect(() => {
    getStudentsWithoutGroup();
  }, [getStudentsWithoutGroup]);

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loading />
          <p className="text-sm text-gray-500">Loading available students...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add Student to Group
            </h3>
            <p className="text-sm text-gray-600">
              Search and select a student to add to the current group
            </p>
          </div>

          {/* Search Section */}
          <div className="space-y-3">
            <div className="relative">
              <Input
                label="Search Students"
                onChange={handleInputChange}
                value={nameInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                placeholder="Type student name or email..."
                leftIcon={
                  <i className="fa-solid fa-search text-gray-400"></i>
                }
                fullWidth
                aria-describedby="search-help"
              />
              
              {/* Dropdown */}
              {showDropdown && filteredStudents.length > 0 && (
                <div 
                  className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
                  role="listbox"
                  aria-label="Available students"
                >
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
                      Available Students ({filteredStudents.length})
                    </div>
                    {filteredStudents.map((student, index) => (
                      <button
                        key={student._id}
                        onClick={() => handleStudentSelect(student)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onMouseLeave={() => setSelectedIndex(-1)}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none rounded-lg transition-all duration-150 group ${
                          selectedIndex === index ? 'bg-blue-50' : ''
                        }`}
                        role="option"
                        aria-selected={selectedIndex === index}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 group-hover:text-blue-700">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {student.email}
                            </div>
                          </div>
                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="fa-solid fa-plus text-blue-500"></i>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* No Students Available Message */}
            {studentsWithoutGroup.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-users text-gray-400 text-xl"></i>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  No students available without a group
                </p>
                <p className="text-xs text-gray-400">
                  All students are already assigned to groups
                </p>
              </div>
            )}
          </div>

          {/* Selected Student Info */}
          {nameInput && nameInput.includes(' ') && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-check text-green-600"></i>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-green-800">
                    Student Selected
                  </div>
                  <div className="text-sm text-green-700">
                    {nameInput}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Tips */}
          {studentsWithoutGroup.length > 0 && !nameInput && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" id="search-help">
              <div className="flex items-start space-x-3">
                <i className="fa-solid fa-lightbulb text-blue-500 mt-0.5"></i>
                <div>
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    Search Tips
                  </div>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Type student's first or last name</li>
                    <li>• Search by email address</li>
                    <li>• Click on a student to select them</li>
                    <li>• Use arrow keys to navigate results</li>
                    <li>• Press Enter to select highlighted student</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Keyboard Navigation Help */}
          {showDropdown && filteredStudents.length > 0 && (
            <div className="text-xs text-gray-500 text-center">
              <span className="inline-flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑↓</kbd>
                <span>Navigate</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
                <span>Select</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                <span>Close</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
