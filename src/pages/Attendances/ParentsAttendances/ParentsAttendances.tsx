import { useState, useEffect } from 'react';
import { useFindAttendancesQuery } from '../api';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';

const ParentsAttendances = () => {
  const { data: user } = useGetMe();
  const children = user?.data?.children || [];

  const [filters, setFilters] = useState({
    student_id: undefined as number | undefined,
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (children.length > 0 && !filters.student_id) {
      setFilters((prev) => ({
        ...prev,
        student_id: children[0].id,
      }));
    }
  }, [children, filters.student_id]);

  const { data, isLoading, error } = useFindAttendancesQuery(
    {
      student_id: filters.student_id,
      start_date: filters.start_date || undefined,
      end_date: filters.end_date || undefined,
    },
    {
      skip: !filters.student_id,
    }
  );
  
  const handleFilterChange = (field: string, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (children.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Student Attendances</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No children found in your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Attendances</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Child
            </label>
            <select
              value={filters.student_id || ''}
              onChange={(e) =>
                handleFilterChange(
                  'student_id',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a child</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.first_name} {child.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {data?.data && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{data?.data?.count}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Attended</p>
              <p className="text-2xl font-bold text-green-600">{data?.data?.attendedCount}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Not Attended</p>
              <p className="text-2xl font-bold text-red-600">{data?.data?.notAttendedCount}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading attendances...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600">Error loading attendances</p>
        </div>
      )}

      {data?.data && data?.data?.attendances.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Lesson Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.attendances.map((attendance) => (
                <tr key={attendance.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendance.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendance.student
                      ? `${attendance.student.first_name} ${attendance.student.last_name}`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attendance.lesson
                      ? new Date(attendance.lesson.lesson_date).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {attendance.lesson?.topic || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        attendance.attended
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {attendance.attended ? 'Attended' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data?.data && data?.data?.attendances.length === 0 && !isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-center">No attendance records found</p>
        </div>
      )}
    </div>
  );
};

export default ParentsAttendances;
