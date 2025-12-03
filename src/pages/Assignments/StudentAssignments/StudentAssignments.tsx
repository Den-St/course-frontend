import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';
import { useGetAssignmentsForStudentGroupQuery } from '../api';
import { routes } from '../../../routes/routes';
import { useGetCoursesByStudentQuery } from '../../Courses/api';

const StudentAssignments = () => {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');

  const { data: currentUser, isLoading: loadingUser } = useGetMe();
  const studentIdentifier = currentUser?.data?.student_id;
  console.log('Student ID:', currentUser?.data);

  const { data: coursesData } = useGetCoursesByStudentQuery(
    { studentId: studentIdentifier! },
    { skip: !studentIdentifier }
  );

  const { 
    data: assignmentsData, 
    isLoading: loadingAssignments, 
    isError: hasError, 
    error: fetchError 
  } = useGetAssignmentsForStudentGroupQuery(
    {
      student_id: studentIdentifier!,
      start_date: dateFrom || undefined,
      end_date: dateTo || undefined,
      course_id: selectedCourseId === '' ? undefined : Number(selectedCourseId),
    },
    {
      skip: !studentIdentifier,
    }
  );

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedCourseId('');
  };

  if (loadingUser) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Loading your information...</div>
      </div>
    );
  }

  if (!studentIdentifier) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Please authenticate to access your assignments</p>
        </div>
      </div>
    );
  }

  if (loadingAssignments) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Fetching assignments...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load assignments: {fetchError?.toString()}</p>
        </div>
      </div>
    );
  }

  const assignmentsList = assignmentsData?.data || [];
  const hasAssignments = assignmentsList.length > 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600 mt-1">View and track all your course assignments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Date Range Filter</h2>
          {(dateFrom || dateTo || selectedCourseId !== '') && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) =>
                setSelectedCourseId(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All courses</option>
              {coursesData?.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {!hasAssignments ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              No assignments available for the selected criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assignment Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Max Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {assignmentsList.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {assignment.title}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {assignment.course?.name || 'N/A'}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {assignment.teacher ? (
                        <span>
                          {assignment.teacher.last_name} {assignment.teacher.first_name}
                          {assignment.teacher.patronym && ` ${assignment.teacher.patronym}`}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(assignment.assign_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span>
                          {new Date(assignment.due_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {new Date(assignment.due_date) < new Date() && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {assignment.max_grade}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => navigate(routes.studentAssignment.getRoute(assignment.id))}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasAssignments && (
        <div className="mt-4 text-sm text-gray-600">
          Total assignments: {assignmentsList.length}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;