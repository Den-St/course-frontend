import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLessonMutation, useGetLessonsForTeacherQuery } from '../api';
import { createLessonSchema, type CreateLessonFormData } from '../schemas';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';
import { useFilterCoursesQuery } from '../../Courses/api';

const TeacherLessons: FC = () => {
  const { data: userData } = useGetMe();
  const user = userData?.data;
  
  const [filterParams, setFilterParams] = useState<{
    course_id?: number;
    start_date?: string;
    end_date?: string;
  }>({});

  const [createLesson, { isLoading, isSuccess, isError, error }] = useCreateLessonMutation();
  const { data: coursesData, isLoading: isLoadingCourses } = useFilterCoursesQuery({});
  const { data: lessonsData, isLoading: isLoadingLessons } = useGetLessonsForTeacherQuery(
    {
      teacher_id: user?.id || 0,
      ...filterParams,
    },
    { skip: !user?.id }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLessonFormData>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      teacher_id: user?.id,
    },
  });

  const onSubmit = async (data: CreateLessonFormData) => {
    try {
      await createLesson({
        ...data,
        teacher_id: user?.id || data.teacher_id || 0,
      }).unwrap();
      reset({
        teacher_id: user?.id,
      });
    } catch (err) {
      console.error('Failed to create lesson:', err);
    }
  };

  const handleFilterChange = (field: keyof typeof filterParams, value: string) => {
    setFilterParams(prev => ({
      ...prev,
      [field]: value ? (field === 'course_id' ? Number(value) : value) : undefined,
    }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Teacher Lessons</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-6">Create New Lesson</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-1">
              Course *
            </label>
            <select
              id="course_id"
              {...register('course_id', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isLoadingCourses}
            >
              <option value="">Select a course</option>
              {coursesData?.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            {errors.course_id && (
              <p className="mt-1 text-sm text-red-600">{errors.course_id.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lesson_date" className="block text-sm font-medium text-gray-700 mb-1">
              Lesson Date *
            </label>
            <input
              id="lesson_date"
              type="date"
              {...register('lesson_date')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.lesson_date && (
              <p className="mt-1 text-sm text-red-600">{errors.lesson_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              id="start_time"
              type="time"
              {...register('start_time')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="HH:MM"
            />
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              id="end_time"
              type="time"
              {...register('end_time')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="HH:MM"
            />
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              {...register('topic')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter lesson topic (optional)"
            />
            {errors.topic && (
              <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
            )}
          </div>

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              Lesson created successfully!
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              Error creating lesson: {error && 'data' in error ? JSON.stringify(error.data) : 'Unknown error'}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Lesson'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Filter Lessons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="filter_course" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              id="filter_course"
              value={filterParams.course_id || ''}
              onChange={(e) => handleFilterChange('course_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingCourses}
            >
              <option value="">All Courses</option>
              {coursesData?.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter_start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="filter_start_date"
              type="date"
              value={filterParams.start_date || ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="filter_end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="filter_end_date"
              type="date"
              value={filterParams.end_date || ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isLoadingLessons && <div className="text-center py-4">Loading lessons...</div>}
        
        {lessonsData && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Lessons ({lessonsData.data.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Course</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Start Time</th>
                    <th className="p-3 text-left">End Time</th>
                    <th className="p-3 text-left">Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {lessonsData.data.map((lesson) => (
                    <tr key={lesson.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{lesson.id}</td>
                      <td className="p-3 font-medium">{lesson.course.name}</td>
                      <td className="p-3">{formatDate(lesson.lesson_date)}</td>
                      <td className="p-3">{lesson.start_time || '-'}</td>
                      <td className="p-3">{lesson.end_time || '-'}</td>
                      <td className="p-3">{lesson.topic || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherLessons;
