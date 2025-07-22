import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CodeModal from "../../Components/Quizzes/CodeModal/CodeModal";
import QuizModal from "../../Components/Quizzes/QuizModal/QuizModal";
import { logOut } from "../../Redux/Slices/AuthSlice/AuthSlice";
import SharedModal from "../Modal/Modal";

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropDownMenuState, setDropDownMenuState] = useState(false);
  const [modalState, setModalState] = useState("close");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { userData } = useSelector((state: any) => state.userData);
  const fullName = `${userData.profile.first_name} ${userData.profile.last_name}`;
  const role = userData.profile.role;
  const isStudent = role === "Student";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropDownMenuState(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropDownMenuState(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDropDownToggle = () => {
    setDropDownMenuState(!dropDownMenuState);
  };

  const handleClose = () => {
    setModalState("close");
  };

  const showAddModal = () => {
    setModalState("add");
  };

  const handleJoinQuiz = () => {
    navigate("/student");
  };

  const handleLogout = async () => {
    setDropDownMenuState(false);
    setIsLoading(true);
    try {
      dispatch(logOut());
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Main NavBar Container */}
      <header className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Section - Title */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Dashboard
              </h1>
            </div>

            {/* Right Section - Actions and User Info */}
            <div className="flex items-center space-x-4">
              
              {/* Action Button */}
              <div className="hidden sm:block">
                {isStudent ? (
                  <button
                    onClick={handleJoinQuiz}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    aria-label="Join Quiz"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Join Quiz
                  </button>
                ) : (
                  <button
                    onClick={showAddModal}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    aria-label="Create New Quiz"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Quiz
                  </button>
                )}
              </div>

              {/* Mobile Action Button */}
              <div className="sm:hidden">
                {isStudent ? (
                  <button
                    onClick={handleJoinQuiz}
                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Join Quiz"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={showAddModal}
                    disabled={isLoading}
                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Create New Quiz"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                )}
              </div>

              {/* User Info Section */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-300">
                
                {/* User Avatar */}
                <div className="flex-shrink-0 relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>

                {/* User Details - Hidden on mobile */}
                <div className="hidden md:block">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 truncate max-w-32">
                      {fullName}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
                      {role}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={handleDropDownToggle}
                    className="flex items-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    aria-label="User menu"
                    aria-expanded={dropDownMenuState}
                    aria-haspopup="true"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropDownMenuState && (
                    <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {/* Mobile User Info */}
                        <div className="md:hidden px-4 py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {fullName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {fullName}
                              </span>
                              <span className="text-xs text-blue-600 font-medium">
                                {role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          disabled={isLoading}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 flex items-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          )}
                          {isLoading ? 'Logging out...' : 'Log Out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SharedModal
        show={modalState === "add"}
        title="Set up a new quiz"
        onSave={() => {
          // Empty function - handled by QuizModal
        }}
        onClose={handleClose}
        body={
          modalState === "add" ? (
            <QuizModal 
              setCode={setCode} 
              setModalState={setModalState} 
              handleClose={handleClose}
            />
          ) : null
        }
      />
      
      <SharedModal
        show={modalState === "quiz-code"}
        title=""
        onSave={() => {
          console.log("Code modal save");
        }}
        omitHeader={true}
        onClose={handleClose}
        body={<CodeModal handleClose={handleClose} code={code} />}
      />
    </>
  );
}
