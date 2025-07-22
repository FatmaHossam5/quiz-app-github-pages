import { useCallback } from 'react';
import { Question, Quiz, User } from '../types';
import { normalizeQuizData } from '../utils/quizDataNormalizer';

export const useMemoizedData = () => {
  // Memoized function to filter and sort quizzes
  const filterAndSortQuizzes = useCallback((
    quizzes: Quiz[],
    searchTerm: string,
    sortBy: 'title' | 'date' | 'status' = 'date',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) => {
    let filtered = quizzes;

    // Filter by search term
    if (searchTerm) {
      filtered = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by specified criteria
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          // Normalize quiz data to ensure schedule field is available
          const normalizedA = normalizeQuizData(a);
          const normalizedB = normalizeQuizData(b);
          aValue = new Date(normalizedA.schedule);
          bValue = new Date(normalizedB.schedule);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, []);

  // Memoized function to filter and sort students
  const filterAndSortStudents = useCallback((
    students: User[],
    searchTerm: string,
    sortBy: 'name' | 'email' | 'score' = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ) => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      filtered = students.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by specified criteria
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'score':
          aValue = a.avg_score || 0;
          bValue = b.avg_score || 0;
          break;
        default:
          aValue = a.first_name;
          bValue = b.first_name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, []);

  // Memoized function to filter and sort questions
  const filterAndSortQuestions = useCallback((
    questions: Question[],
    searchTerm: string,
    difficultyFilter: 'all' | 'easy' | 'medium' | 'hard' = 'all',
    typeFilter: 'all' | 'MCQ' | 'True/False' = 'all'
  ) => {
    let filtered = questions;

    // Filter by search term
    if (searchTerm) {
      filtered = questions.filter(question =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(question => question.difficulty === difficultyFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(question => question.type === typeFilter);
    }

    return filtered;
  }, []);

  // Memoized function to calculate quiz statistics
  const calculateQuizStats = useCallback((quizzes: Quiz[]) => {
    const total = quizzes.length;
    const completed = quizzes.filter(q => q.status === 'completed').length;
    const published = quizzes.filter(q => q.status === 'published').length;
    const draft = quizzes.filter(q => q.status === 'draft').length;

    const averageQuestions = total > 0 
      ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.questions_number, 0) / total)
      : 0;

    const difficultyDistribution = quizzes.reduce((acc, quiz) => {
      acc[quiz.difficulty] = (acc[quiz.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      completed,
      published,
      draft,
      averageQuestions,
      difficultyDistribution,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, []);

  // Memoized function to calculate student performance
  const calculateStudentPerformance = useCallback((students: User[]) => {
    const totalStudents = students.length;
    const studentsWithScores = students.filter(s => s.avg_score !== undefined);
    
    if (studentsWithScores.length === 0) {
      return {
        totalStudents,
        averageScore: 0,
        topPerformers: [],
        lowPerformers: [],
        scoreDistribution: {}
      };
    }

    const averageScore = studentsWithScores.reduce((sum, student) => 
      sum + (student.avg_score || 0), 0
    ) / studentsWithScores.length;

    const sortedByScore = [...studentsWithScores].sort((a, b) => 
      (b.avg_score || 0) - (a.avg_score || 0)
    );

    const topPerformers = sortedByScore.slice(0, 5);
    const lowPerformers = sortedByScore.slice(-5).reverse();

    const scoreDistribution = studentsWithScores.reduce((acc, student) => {
      const score = student.avg_score || 0;
      const range = score >= 90 ? '90-100' : 
                   score >= 80 ? '80-89' :
                   score >= 70 ? '70-79' :
                   score >= 60 ? '60-69' : '0-59';
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      topPerformers,
      lowPerformers,
      scoreDistribution
    };
  }, []);

  // Memoized function to format dates
  const formatDate = useCallback((dateString: string | null | undefined) => {
    try {
      // Handle null, undefined, or empty strings
      if (!dateString || dateString.trim() === '') {
        return 'No date set';
      }

      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date format';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Date unavailable';
    }
  }, []);

  // Memoized function to calculate time remaining
  const calculateTimeRemaining = useCallback((endTime: string | null | undefined) => {
    try {
      // Handle null, undefined, or empty strings
      if (!endTime || endTime.trim() === '') {
        return { expired: true, display: 'No end time set' };
      }

      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      
      // Check if end date is valid
      if (isNaN(end)) {
        return { expired: true, display: 'Invalid end time' };
      }
      
      const remaining = end - now;

      if (remaining <= 0) {
        return { expired: true, display: 'Expired' };
      }

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      let display = '';
      if (days > 0) display += `${days}d `;
      if (hours > 0) display += `${hours}h `;
      if (minutes > 0) display += `${minutes}m`;

      return { expired: false, display: display.trim() || '< 1m' };
    } catch (error) {
      return { expired: true, display: 'Time unavailable' };
    }
  }, []);

  return {
    filterAndSortQuizzes,
    filterAndSortStudents,
    filterAndSortQuestions,
    calculateQuizStats,
    calculateStudentPerformance,
    formatDate,
    calculateTimeRemaining
  };
}; 
