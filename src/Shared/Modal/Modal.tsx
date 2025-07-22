import React, { ReactNode, useEffect, useRef } from 'react';

interface SharedModalProps {
  show?: boolean;
  title?: string;
  body: ReactNode;
  onClose: () => void;
  onSave?: () => void;
  omitHeader?: boolean;
  modalType?: 'default' | 'delete' | 'warning' | 'success';
  saveButtonText?: string;
  closeButtonText?: string;
}

const SharedModal: React.FC<SharedModalProps> = ({
  show,
  title,
  body,
  onClose,
  onSave,
  omitHeader,
  modalType = 'default',
  saveButtonText,
  closeButtonText,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  // Get modal styling based on type
  const getModalStyling = () => {
    switch (modalType) {
      case 'delete':
        return 'border-red-200 shadow-red-100';
      case 'warning':
        return 'border-yellow-200 shadow-yellow-100';
      case 'success':
        return 'border-green-200 shadow-green-100';
      default:
        return 'border-gray-200 shadow-gray-100';
    }
  };

  // Get header icon based on type
  const getHeaderIcon = () => {
    switch (modalType) {
      case 'delete':
        return 'fa-solid fa-exclamation-triangle text-red-600';
      case 'warning':
        return 'fa-solid fa-exclamation-triangle text-yellow-600';
      case 'success':
        return 'fa-solid fa-check-circle text-green-600';
      default:
        return 'fa-solid fa-info-circle text-blue-600';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${
        show ? 'flex justify-center items-start sm:items-center p-2 sm:p-4' : 'hidden'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto rounded-xl shadow-2xl transform transition-all duration-300 ease-out border ${getModalStyling()} ${
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div
          className={`header flex justify-between items-center border-b border-gray-200 dark:border-gray-700 ${
            omitHeader ? 'hidden' : 'px-6 py-5'
          }`}
        >
          <div className="flex items-center">
            <i className={`${getHeaderIcon()} mr-3 text-xl`}></i>
            <div className='headerName text-lg sm:text-xl font-semibold text-gray-900 dark:text-white' id="modal-title">
              {title}
            </div>
          </div>
          <div className='Icons-close-save flex items-center gap-2'>
            {onSave && modalType !== 'delete' && (
              <button
                className='p-2.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                onClick={onSave}
                aria-label={saveButtonText || "Save"}
                title={saveButtonText || "Save"}
              >
                <i className='fa-solid fa-check text-lg'></i>
              </button>
            )}
            <button
              className='p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
              aria-label={closeButtonText || 'Close'}
              onClick={onClose}
              title={closeButtonText || 'Close'}
            >
              <i className='fa-solid fa-xmark text-lg'></i>
            </button>
          </div>
        </div>
        
        {/* Body with improved scrolling */}
        <div className='overflow-y-auto max-h-[70vh] sm:max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
          {body}
        </div>
      </div>
    </div>
  );
};

export default SharedModal;
