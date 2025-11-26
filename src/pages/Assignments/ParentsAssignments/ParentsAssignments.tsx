import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';
import { useGetAssignmentsForStudentGroupQuery } from '../api';
import { routes } from '../../../routes/routes';

const ParentsAssignments = () => {
  const navigate = useNavigate();
  const { data: meData, isLoading: userLoading } = useGetMe();
  const childrenArray = meData?.data?.children || [];

  const [selectedStudent, setSelectedStudent] = useState<number | undefined>(undefined);
  const [timeRange, setTimeRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (childrenArray.length > 0 && selectedStudent === undefined) {
      setSelectedStudent(childrenArray[0].id);
    }
  }, [childrenArray, selectedStudent]);

  const { 
    data: assignmentsResponse, 
    isLoading: assignmentsLoading, 
    isError: hasLoadError, 
    error: apiError 
  } = useGetAssignmentsForStudentGroupQuery(
    {
      student_id: selectedStudent!,
      start_date: timeRange.startDate || undefined,
      end_date: timeRange.endDate || undefined,
    },
    {
      skip: selectedStudent === undefined,
    }
  );

  const updateStudentSelection = (studentIdValue: string) => {
    setSelectedStudent(studentIdValue ? Number(studentIdValue) : undefined);
  };

  const updateTimeRange = (rangeField: 'startDate' | 'endDate', dateValue: string) => {
    setTimeRange((prev) => ({
      ...prev,
      [rangeField]: dateValue,
    }));
  };

  const resetFilters = () => {
    setTimeRange({
      startDate: '',
      endDate: '',
    });
  };

  if (userLoading) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Loading account information...</div>
      </div>
    );
  }

  if (childrenArray.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Child's Assignments</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No children associated with your account.</p>
        </div>
      </div>
    );
  }
  const assignmentRecords = assignmentsResponse?.data || [];
  const hasRecords = assignmentRecords.length > 0;
  console.log('assignmentRecords',assignmentRecords);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Child's Assignments</h1>
        <p className="text-gray-600 mt-1">Monitor and review your child's academic assignments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Filter Options</h2>
          {(timeRange.startDate || timeRange.endDate) && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset Dates
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student
            </label>
            <select
              value={selectedStudent || ''}
              onChange={(e) => updateStudentSelection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a student</option>
              {childrenArray.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.first_name} {child.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={timeRange.startDate}
              onChange={(e) => updateTimeRange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={timeRange.endDate}
              onChange={(e) => updateTimeRange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {assignmentsLoading && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="text-gray-600">Retrieving assignments...</div>
        </div>
      )}

      {hasLoadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Unable to fetch assignments</p>
        </div>
      )}

      {!assignmentsLoading && !hasLoadError && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {!hasRecords ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">
                No assignments match the current selection
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {assignmentRecords.map((assignment) => {
                    const isDue = new Date(assignment.due_date) < new Date();
                    
                    return (
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
                            {isDue && (
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
                            onClick={() => navigate(routes.parentsAssignment.getRoute(assignment.id))}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {hasRecords && !assignmentsLoading && !hasLoadError && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {assignmentRecords.length} assignment{assignmentRecords.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ParentsAssignments;
