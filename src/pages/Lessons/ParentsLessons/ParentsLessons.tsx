import { useState, useEffect } from 'react';
import { useGetLessonsForStudentQuery } from '../api';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';

const ParentsLessons = () => {
  const { data: userData } = useGetMe();
  const childrenList = userData?.data?.children || [];

  const [selectedChild, setSelectedChild] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  useEffect(() => {
    if (childrenList.length > 0 && selectedChild === undefined) {
      setSelectedChild(childrenList[0].id);
    }
  }, [childrenList, selectedChild]);

  const { data: lessonsData, isLoading: fetchingLessons, error: loadError } = useGetLessonsForStudentQuery(
    {
      student_id: selectedChild!,
      start_date: dateRange.from || undefined,
      end_date: dateRange.to || undefined,
    },
    {
      skip: selectedChild === undefined,
    }
  );

  const handleChildSelection = (childId: string) => {
    setSelectedChild(childId ? Number(childId) : undefined);
  };

  const handleDateUpdate = (field: 'from' | 'to', value: string) => {
    setDateRange((current) => ({
      ...current,
      [field]: value,
    }));
  };

  if (childrenList.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Child's Lessons Schedule</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No children registered in your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Child's Lessons Schedule</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Search Criteria</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose Child
            </label>
            <select
              value={selectedChild || ''}
              onChange={(e) => handleChildSelection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pick a child</option>
              {childrenList.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.first_name} {child.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => handleDateUpdate('from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => handleDateUpdate('to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {fetchingLessons && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Fetching lessons...</p>
        </div>
      )}

      {loadError && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600">Failed to load lessons data</p>
        </div>
      )}

      {!loadError && lessonsData?.data && lessonsData.data.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lesson ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessonsData.data.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${lesson.teacher.first_name} ${lesson.teacher.last_name}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(lesson.lesson_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.start_time && lesson.end_time
                        ? `${lesson.start_time} - ${lesson.end_time}`
                        : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lesson.topic || 'No topic'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {lessonsData?.data && lessonsData.data.length === 0 && !fetchingLessons && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-center">No lessons found for the selected criteria</p>
        </div>
      )}
    </div>
  );
};

export default ParentsLessons;
