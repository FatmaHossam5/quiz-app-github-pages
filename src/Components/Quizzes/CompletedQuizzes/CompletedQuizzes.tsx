import { Link } from "react-router-dom";
import { Quiz } from "../../../types";

interface CompletedQuizzes {
  completedQuizzes: Quiz[];
}

export default function CompletedQuizzes({
  completedQuizzes,
}: CompletedQuizzes) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Completed Quizzes</h3>
            <p className="text-sm text-gray-500">Recently completed quizzes</p>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-check text-green-600"></i>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!completedQuizzes || completedQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-clipboard-check text-gray-400 text-xl"></i>
            </div>
            <p className="text-gray-500 text-lg font-medium">No completed quizzes</p>
            <p className="text-gray-400 text-sm mt-1">Completed quizzes will appear here</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedQuizzes
                      .slice(0, 3)
                      .map((result: Quiz, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{result.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {result.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            17
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.closed_at?.split("T")[0]}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {completedQuizzes
                .slice(0, 3)
                .map((result: Quiz, idx: number) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{result.title}</h4>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {result.type}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>17 participants</span>
                      <span>{result.closed_at?.split("T")[0]}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Show more link if there are more quizzes */}
            {completedQuizzes.length > 3 && (
              <div className="text-center pt-6 border-t border-gray-100 mt-6">
                <Link
                  to="/dashboard/results"
                  className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
                >
                  View all {completedQuizzes.length} completed quizzes
                  <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
