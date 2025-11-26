import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';
import { useFilterSubmissionsMutation } from '../api';
import { routes } from '../../../routes/routes';

const StudentSubmissions = () => {
  const navigate = useNavigate();
  const { data: userData } = useGetMe();
  const user = userData?.data;

  const [filterSubmissions, { data: submissionsData, isLoading, error }] = useFilterSubmissionsMutation();

  useEffect(() => {
    if (user?.student_id) {
      filterSubmissions({ student_id: user.student_id });
    }
  }, [user?.student_id, filterSubmissions]);

  const submissions = submissionsData?.data || [];

  const handleViewSubmission = (assignmentId: number) => {
    navigate(routes.studentAssignment.getRoute(assignmentId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Submissions</h1>

      {isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600">Error loading submissions</p>
        </div>
      )}

      {!isLoading && !error && submissions.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">You haven't submitted any assignments yet.</p>
        </div>
      )}

      {!isLoading && !error && submissions.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.assignment.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {submission.assignment.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(submission.submitted_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(submission.submitted_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        submission.is_late
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {submission.is_late ? 'Late' : 'On Time'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.grade ? (
                        <div className="text-sm font-semibold text-gray-900">
                          {submission.grade.grade_value}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.submissionFeedback ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Available
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewSubmission(submission.assignment_id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSubmissions;
