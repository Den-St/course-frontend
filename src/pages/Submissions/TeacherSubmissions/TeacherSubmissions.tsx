import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilterSubmissionsMutation } from '../api';
import type { FilterSubmissionRequestDto } from '../types/types';
import { routes } from '../../../routes/routes';

const TeacherSubmissions = () => {
  const [filters, setFilters] = useState<FilterSubmissionRequestDto>({});
  const navigate = useNavigate();

  const [filterSubmissions, { data: submissions, isLoading, error }] = useFilterSubmissionsMutation();

  useEffect(() => {
    filterSubmissions(filters);
  }, [filters, filterSubmissions]);

  const handleFilterChange = (key: keyof FilterSubmissionRequestDto, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleViewSubmission = (id: number) => {
    navigate(routes.teacherSubmission.getRoute(id));
  };

  console.log('submissions', submissions);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Submissions</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment ID
            </label>
            <input
              type="number"
              value={filters.assignment_id ?? ''}
              onChange={(e) => handleFilterChange('assignment_id', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter assignment ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="number"
              value={filters.student_id ?? ''}
              onChange={(e) => handleFilterChange('student_id', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter student ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group ID
            </label>
            <input
              type="number"
              value={filters.group_id ?? ''}
              onChange={(e) => handleFilterChange('group_id', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter group ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher ID
            </label>
            <input
              type="number"
              value={filters.teacher_id ?? ''}
              onChange={(e) => handleFilterChange('teacher_id', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter teacher ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={filters.title ?? ''}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={filters.description ?? ''}
              onChange={(e) => handleFilterChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Is Late
            </label>
            <select
              value={filters.is_late === undefined ? '' : filters.is_late.toString()}
              onChange={(e) => handleFilterChange('is_late', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Given
            </label>
            <select
              value={filters.feedback_given === undefined ? '' : filters.feedback_given.toString()}
              onChange={(e) => handleFilterChange('feedback_given', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submitted From
            </label>
            <input
              type="date"
              value={filters.submitted_from ?? ''}
              onChange={(e) => handleFilterChange('submitted_from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submitted To
            </label>
            <input
              type="date"
              value={filters.submitted_to ?? ''}
              onChange={(e) => handleFilterChange('submitted_to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {isLoading && <p>Loading submissions...</p>}
        {error && <p className="text-red-600">Error loading submissions</p>}
        
        {submissions && submissions.data.length === 0 && (
          <p className="text-gray-500">No submissions found</p>
        )}

        {submissions && submissions.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.data.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.student.first_name} {submission.student.last_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {submission.assignment.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(submission.submitted_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        submission.is_late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {submission.is_late ? 'Late' : 'On Time'}
                      </span>
                      {submission.feedback_given && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Feedback Given
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.grade ? submission.grade.grade_value : 'Not graded'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewSubmission(submission.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
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
    </div>
  );
};

export default TeacherSubmissions;
