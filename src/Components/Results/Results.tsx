import { Link } from "react-router-dom";
import { getData } from "../../ApiUtils/ApiUtils";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import NoData from "../../Shared/NoData/NoData";
import Loading from "../../Shared/Loading/Loading";

export default function Results() {
  const { headers } = useSelector((state: any) => state.userData);
  const [getResults, setGetResults] = useState<object[]>();
  const [isLoading, setIsLoading] = useState(true);

  const getAllResults = () => {
    try {
      setIsLoading(true);
      getData({ path: 'quiz/result', headers, setState: setGetResults });
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllResults();
  }, []);

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Quiz Results
              </h1>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                View and analyze quiz performance results
              </p>
            </div>
            
            {/* Stats Section */}
            {getResults && getResults.length > 0 && (
              <div className="mt-4 sm:mt-0">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <i className="fa-solid fa-chart-bar mr-2 text-blue-500"></i>
                    <span>Total Results: <span className="font-semibold text-gray-900">{getResults.length}</span></span>
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-users mr-2 text-green-500"></i>
                    <span>Total Participants: <span className="font-semibold text-gray-900">
                      {getResults.reduce((acc: number, result: any) => acc + (result.participants?.length || 0), 0)}
                    </span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Results Overview</h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loading />
                <p className="mt-4 text-sm text-gray-500">Loading quiz results...</p>
              </div>
            </div>
          )}

          {/* Results Table */}
          {!isLoading && (
            <div className="overflow-x-auto">
              {!getResults || getResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-chart-line text-gray-400 text-xl"></i>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No results available</p>
                  <p className="text-gray-400 text-sm mt-1">Quiz results will appear here once quizzes are completed</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getResults.map((result: any, index: number) => (
                      <tr 
                        key={index}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i className="fa-solid fa-question text-blue-600"></i>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {result.quiz?.title || 'Untitled Quiz'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {result.quiz?._id?.slice(-8) || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {result.quiz?.type || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.quiz?.status)}`}>
                            {result.quiz?.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <i className="fa-solid fa-users mr-2 text-gray-400"></i>
                            <span className="text-sm text-gray-900 font-medium">
                              {result.participants?.length || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            to={`/dashboard/results/${encodeURIComponent(result.quiz?.title || '')}`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm hover:shadow-md"
                          >
                            <i className="fa-solid fa-eye mr-2"></i>
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Mobile Card View (Hidden on desktop) */}
        {!isLoading && getResults && getResults.length > 0 && (
          <div className="md:hidden mt-6 space-y-4">
            {getResults.map((result: any, index: number) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <i className="fa-solid fa-question text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {result.quiz?.title || 'Untitled Quiz'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {result.quiz?.type || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.quiz?.status)}`}>
                    {result.quiz?.status || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fa-solid fa-users mr-1"></i>
                    <span>{result.participants?.length || 0} participants</span>
                  </div>
                  <Link 
                    to={`/dashboard/results/${encodeURIComponent(result.quiz?.title || '')}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <i className="fa-solid fa-eye mr-1"></i>
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
