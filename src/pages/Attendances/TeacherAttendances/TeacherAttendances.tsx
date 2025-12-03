import { useEffect, useState } from 'react';
import { useFindAttendancesQuery } from '../api';
import type { FindAttendanceRequestDto } from '../types';
import { useGetMe } from '../../../api/authMe';
import { useFilterGroupsByTeacherEnrollmentsQuery } from '../../Groups/api';
import { useFilterStudentsByTeacherEnrollmentsQuery } from '../../Students/api';
import { useFilterCoursesQuery } from '../../Courses/api';
import { useGetLessonsForTeacherQuery } from '../../Lessons/api';
import { useCreateAttendanceMutation } from '../api';

const TeacherAttendances = () => {
  const { data: currentUser } = useGetMe();
  const teacherId = currentUser?.data.id;

  const [filters, setFilters] = useState<FindAttendanceRequestDto>({});
  const { data: attendancesRes, isLoading, error, refetch } = useFindAttendancesQuery(filters, {
    skip: !teacherId,
  });

  const { data: teacherGroups } = useFilterGroupsByTeacherEnrollmentsQuery(
    { teacher_id: teacherId! },
    { skip: !teacherId }
  );
  const { data: teacherStudents } = useFilterStudentsByTeacherEnrollmentsQuery(
    { teacher_id: teacherId! },
    { skip: !teacherId }
  );
  const { data: coursesData } = useFilterCoursesQuery(
    { teacher_id: teacherId },
    { skip: !teacherId }
  );
  const { data: lessonsForTeacher } = useGetLessonsForTeacherQuery(
    { teacher_id: teacherId!, course_id: filters.course_id },
    { skip: !teacherId }
  );

  // create attendance form state
  const [newAttendance, setNewAttendance] = useState<{ student_id?: number; lesson_id?: number; attended: boolean }>({
    attended: true,
  });
  const [createAttendance, { isLoading: isCreatingAttendance }] = useCreateAttendanceMutation();

  const handleCreateChange = (key: 'student_id' | 'lesson_id' | 'attended', value: string | boolean) => {
    setNewAttendance(prev => ({
      ...prev,
      [key]: key === 'attended' ? Boolean(value) : value === '' ? undefined : Number(value),
    }));
  };

  const submitCreateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttendance.student_id || !newAttendance.lesson_id) return;
    try {
      await createAttendance({
        student_id: newAttendance.student_id,
        lesson_id: newAttendance.lesson_id,
        attended: newAttendance.attended,
      }).unwrap();
      setNewAttendance({ attended: true });
      refetch();
    } catch (err) {
      // no-op; error handled by RTK Query if needed
    }
  };

  useEffect(() => {
    if (teacherId) refetch();
  }, [filters, teacherId, refetch]);

  const handleFilterChange = (key: keyof FindAttendanceRequestDto, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === ''
        ? undefined
        : ['group_id', 'student_id', 'lesson_id', 'course_id'].includes(key as string)
          ? Number(value)
          : value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Attendances</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select
              value={filters.group_id ?? ''}
              onChange={(e) => handleFilterChange('group_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Groups</option>
              {teacherGroups?.groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} (#{g.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select
              value={filters.student_id ?? ''}
              onChange={(e) => handleFilterChange('student_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Students</option>
              {teacherStudents?.students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name} (#{s.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              value={filters.course_id ?? ''}
              onChange={(e) => handleFilterChange('course_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Courses</option>
              {coursesData?.courses.map(course => (
                <option key={course.id} value={course.id}>{course.name} (#{course.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
            <select
              value={filters.lesson_id ?? ''}
              onChange={(e) => handleFilterChange('lesson_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Lessons</option>
              {lessonsForTeacher?.data.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  #{lesson.id} {lesson.topic ?? ''} {lesson.lesson_date ? `(${new Date(lesson.lesson_date).toLocaleDateString()})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={filters.start_date ?? ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={filters.end_date ?? ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Create Attendance Form */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Create Attendance</h2>
        <form onSubmit={submitCreateAttendance} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select
              value={newAttendance.student_id ?? ''}
              onChange={(e) => handleCreateChange('student_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select student</option>
              {teacherStudents?.students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name} (#{s.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
            <select
              value={newAttendance.lesson_id ?? ''}
              onChange={(e) => handleCreateChange('lesson_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select lesson</option>
              {lessonsForTeacher?.data.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  #{lesson.id} {lesson.topic ?? ''} {lesson.lesson_date ? `(${new Date(lesson.lesson_date).toLocaleDateString()})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Attended</label>
            <input
              type="checkbox"
              checked={newAttendance.attended}
              onChange={(e) => handleCreateChange('attended', e.target.checked)}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={isCreatingAttendance || !newAttendance.student_id || !newAttendance.lesson_id}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isCreatingAttendance ? 'Creating...' : 'Create Attendance'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {isLoading && <p>Loading attendances...</p>}
        {error && <p className="text-red-600">Error loading attendances</p>}
        {attendancesRes && attendancesRes.data.attendances.length === 0 && (
          <p className="text-gray-500">No attendances found</p>
        )}

        {attendancesRes && attendancesRes.data.attendances.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lesson</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendancesRes.data.attendances.map(att => (
                  <tr key={att.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {att.student
                        ? `${att.student.first_name} ${att.student.last_name}`
                        : att.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {att.lesson
                        ? // prefer title, then topic, else show ID
                          // @ts-expect-error backend may provide title; fallback to topic
                          (att.lesson.title ?? att.lesson.topic ?? att.lesson.id)
                        : att.lesson_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {att.lesson ? att.lesson.course_id : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {att.lesson ? new Date(att.lesson.lesson_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${att.attended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {att.attended ? 'Attended' : 'Missed'}
                      </span>
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

export default TeacherAttendances;
