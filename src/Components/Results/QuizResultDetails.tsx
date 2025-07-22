import { useParams, Link } from "react-router-dom";
import { getData } from "../../ApiUtils/ApiUtils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../../Shared/Loading/Loading";
import NoData from "../../Shared/NoData/NoData";

interface Participant {
  _id: string;
  quiz: {
    _id: string;
    title: string;
  };
  participant: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  score: number;
  started_at: string;
  finished_at: string;
}

interface Quiz {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  instructor: string;
  group: string;
  questions_number: number;
  schadule: string;
  duration: number;
  score_per_question: number;
  type: string;
  difficulty: string;
  updatedAt: string;
  createdAt: string;
  closed_at: string;
}

interface QuizResult {
  quiz: Quiz;
  participants: Participant[];
}

export default function QuizResultDetails() {
  const { quizTitle } = useParams<{ quizTitle: string }>();
  const { headers } = useSelector((state: any) => state.userData);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizResult = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all results and find the specific quiz
        getData({ 
          path: 'quiz/result', 
          headers,
          setState: (results: QuizResult[]) => {
            const decodedTitle = decodeURIComponent(quizTitle || '');
            const foundResult = results.find((result: QuizResult) => 
              result.quiz.title === decodedTitle
            );
            
            if (foundResult) {
              setQuizResult(foundResult);
            } else {
              setError('Quiz result not found');
            }
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching quiz result:', error);
        setError('Failed to load quiz result');
        setIsLoading(false);
      }
    };

    if (quizTitle) {
      fetchQuizResult();
    }
  }, [quizTitle, headers]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Helper function to calculate duration
  const calculateDuration = (startedAt: string, finishedAt: string) => {
    const start = new Date(startedAt);
    const finish = new Date(finishedAt);
    const diffMs = finish.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-sm text-gray-500">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-exclamation-triangle text-red-500 text-xl"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link 
            to="/dashboard/results"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  if (!quizResult) {
    return <NoData />;
  }

  const { quiz, participants } = quizResult;
  const totalPossibleScore = quiz.questions_number * quiz.score_per_question;
  const averageScore = participants.length > 0 
    ? participants.reduce((sum, p) => sum + p.score, 0) / participants.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to="/dashboard/results"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Back to Results
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {quiz.title}
              </h1>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                {quiz.description}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quiz.status)}`}>
                {quiz.status}
              </span>
            </div>
          </div>
        </div>

        {/* Quiz Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-users text-blue-600"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Participants</p>
                <p className="text-2xl font-semibold text-gray-900">{participants.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-green-600"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {averageScore.toFixed(1)}/{totalPossibleScore}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-question text-purple-600"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Questions</p>
                <p className="text-2xl font-semibold text-gray-900">{quiz.questions_number}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-clock text-orange-600"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-2xl font-semibold text-gray-900">{quiz.duration}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quiz Information</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Basic Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Quiz Code:</dt>
                    <dd className="text-sm font-medium text-gray-900">{quiz.code}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Type:</dt>
                    <dd className="text-sm font-medium text-gray-900">{quiz.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Difficulty:</dt>
                    <dd className="text-sm font-medium text-gray-900 capitalize">{quiz.difficulty}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Score per Question:</dt>
                    <dd className="text-sm font-medium text-gray-900">{quiz.score_per_question}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Timing</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Scheduled:</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatDate(quiz.schadule)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Created:</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatDate(quiz.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Closed:</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatDate(quiz.closed_at)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Participants</h2>
          </div>
          
          {participants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-users text-gray-400 text-xl"></i>
              </div>
              <p className="text-gray-500 text-lg font-medium">No participants</p>
              <p className="text-gray-400 text-sm mt-1">No students have taken this quiz yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Finished
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr key={participant._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <i className="fa-solid fa-user text-blue-600"></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {participant.participant.first_name} {participant.participant.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {participant.participant.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{participant.score}</span>
                          <span className="text-gray-500">/{totalPossibleScore}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {((participant.score / totalPossibleScore) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(participant.started_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(participant.finished_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculateDuration(participant.started_at, participant.finished_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 