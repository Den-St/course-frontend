import { useState } from 'react';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';
import { useGetLessonsForStudentQuery } from '../api';
import type { StudentLessonDto } from '../types/types';

const StudentLessons = () => {
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const studentId = userData?.data?.student_id;

  const { data: lessons, isLoading, isError, error } =
    useGetLessonsForStudentQuery(
      {
        student_id: studentId!,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      },
      {
        skip: !studentId,
      }
    );

  if (isUserLoading) return <div className="p-6">Loading user data...</div>;
  if (!studentId) return <div className="p-6">Please log in to view lessons</div>;
  if (isLoading) return <div className="p-6">Loading lessons...</div>;
  if (isError)
    return (
      <div className="p-6 text-red-600">
        Error loading lessons: {error?.toString()}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Lessons</h1>

      {/* Filters Box */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-lg shadow p-4">
        {!lessons || lessons.data.length === 0 ? (
          <p className="text-gray-500">No lessons found for the selected period</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grade Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {lessons.data.map((lesson: StudentLessonDto) => (
                  <tr key={lesson.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.topic || 'No topic'}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lesson.course.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {lesson.teacher.last_name} {lesson.teacher.first_name}{' '}
                      {lesson.teacher.patronym}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {new Date(lesson.lesson_date).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {lesson.start_time} – {lesson.end_time}
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

export default StudentLessons;
