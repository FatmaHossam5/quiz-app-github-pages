import copy from "copy-to-clipboard";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface CodeModal {
  handleClose: () => void;
  code: string;
}

export default function CodeModal({ handleClose, code }: CodeModal) {
  const codeRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    const copyText = codeRef.current?.value;
    const isCopy = copy(copyText || "");
    if (isCopy) {
      setIsCopied(true);
      toast.success("Quiz code copied to clipboard!");
      
      // Reset copy state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast.error("Failed to copy code");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      copyToClipboard();
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="text-center max-w-md w-full">
          {/* Success Icon with improved styling */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4">
              <i className="fa-solid fa-check text-2xl sm:text-3xl text-green-600"></i>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Quiz Created Successfully!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8">
            Share this code with your students to join the quiz
          </p>

          {/* Code Section with improved layout */}
          <div className="mb-8">
            <label htmlFor="quiz-code" className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Code
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  id="quiz-code"
                  ref={codeRef}
                  defaultValue={code}
                  readOnly
                  className="w-full px-4 py-3 text-center text-lg sm:text-xl font-mono font-bold bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  aria-label="Quiz code"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    READ-ONLY
                  </span>
                </div>
              </div>
              
              {/* Copy Button with improved UX */}
              <button
                onClick={copyToClipboard}
                onKeyDown={handleKeyDown}
                className={`flex-shrink-0 px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isCopied
                    ? 'bg-green-500 text-white focus:ring-green-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                }`}
                aria-label={isCopied ? "Code copied!" : "Copy quiz code to clipboard"}
                title={isCopied ? "Code copied!" : "Copy to clipboard"}
              >
                <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'} text-sm`}></i>
                <span className="ml-2 text-sm hidden sm:inline">
                  {isCopied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                copyToClipboard();
                handleClose();
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Copy & Close
            </button>
          </div>

          {/* Additional Help Text */}
          <p className="text-xs text-gray-500 mt-4">
            Students can enter this code on the quiz page to join
          </p>
        </div>
      </div>
    </div>
  );
}
