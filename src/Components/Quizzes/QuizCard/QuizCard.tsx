import React, { memo, useMemo, useCallback } from 'react';
import { Quiz } from '../../../types';
import { useMemoizedData } from '../../../hooks/useMemoizedData';
import { normalizeQuizData } from '../../../utils/quizDataNormalizer';

interface QuizCardProps {
  quiz: Quiz;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quizId: string) => void;
  onView?: (quizId: string) => void;
  onShare?: (quizCode: string) => void;
  showActions?: boolean;
  className?: string;
}

const QuizCard: React.FC<QuizCardProps> = memo(({
  quiz,
  onEdit,
  onDelete,
  onView,
  onShare,
  showActions = true,
  className = '',
}) => {
  const { formatDate, calculateTimeRemaining } = useMemoizedData();

  // Normalize quiz data to handle field name mismatches
  const normalizedQuiz = useMemo(() => normalizeQuizData(quiz), [quiz]);

  // Memoize formatted date
  const formattedDate = useMemo(() => formatDate(normalizedQuiz.schedule), [formatDate, normalizedQuiz.schedule]);

  // Memoize time remaining calculation
  const timeRemaining = useMemo(() => calculateTimeRemaining(normalizedQuiz.schedule), [calculateTimeRemaining, normalizedQuiz.schedule]);

  // Memoize status styling
  const statusStyle = useMemo(() => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (normalizedQuiz.status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }, [normalizedQuiz.status]);

  // Memoize difficulty styling
  const difficultyStyle = useMemo(() => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (normalizedQuiz.difficulty) {
      case 'easy':
        return `${baseClasses} bg-green-50 text-green-700 border border-green-200`;
      case 'medium':
        return `${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`;
      case 'hard':
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  }, [normalizedQuiz.difficulty]);

  // Memoized event handlers
  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(normalizedQuiz);
    }
  }, [onEdit, normalizedQuiz]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(normalizedQuiz._id);
    }
  }, [onDelete, normalizedQuiz._id]);

  const handleView = useCallback(() => {
    if (onView) {
      onView(normalizedQuiz._id);
    }
  }, [onView, normalizedQuiz._id]);

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(normalizedQuiz.code);
    }
  }, [onShare, normalizedQuiz.code]);

  // Memoize the progress percentage
  const progressPercentage = useMemo(() => {
    if (normalizedQuiz.status === 'completed') return 100;
    if (normalizedQuiz.status === 'draft') return 25;
    return 75; // published
  }, [normalizedQuiz.status]);

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {normalizedQuiz.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {normalizedQuiz.description}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <span className={statusStyle}>
            {normalizedQuiz.status}
          </span>
        </div>
      </div>

      {/* Quiz Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">
            {normalizedQuiz.questions_number} questions
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">
            {normalizedQuiz.duration} minutes
          </span>
        </div>
      </div>

      {/* Difficulty and Score */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Difficulty:</span>
          <span className={difficultyStyle}>
            {normalizedQuiz.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Score:</span>
          <span className="text-sm font-medium text-gray-900">
            {normalizedQuiz.score_per_question} pts/question
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs text-gray-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Schedule Information */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm text-gray-600 truncate">
            {formattedDate}
          </span>
        </div>
        {!timeRemaining.expired && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-blue-600 font-medium truncate">
              {timeRemaining.display}
            </span>
          </div>
        )}
      </div>

      {/* Quiz Code */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Code:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
            {normalizedQuiz.code}
          </code>
        </div>
        <button
          onClick={handleShare}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Copy
        </button>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          {onView && (
            <button
              onClick={handleView}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm text-green-600 hover:text-green-800 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
});

QuizCard.displayName = 'QuizCard';

export default QuizCard; 
