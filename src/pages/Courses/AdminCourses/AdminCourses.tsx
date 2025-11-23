import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCourseSchema, type CreateCourseFormData } from './schema';
import { useCreateCourseMutation, useFilterCoursesQuery } from '../api';
import { useGetTeachersSortedQuery } from '../../Teachers/api';
import { useSearchStudentsMutation } from '../../Students/api';
import { formatFullName } from '../../../helpers/formatFullName';
import { useState, useEffect } from 'react';

const AdminCourses = () => {
  const [filterParams, setFilterParams] = useState<{
    student_id?: number;
    teacher_id?: number;
  }>({});

  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const { data: teachers, isLoading: isLoadingTeachers } = useGetTeachersSortedQuery({
    sortBy: 'hireDate',
    order: 'ASC',
  });
  
  const [searchStudents, { data: studentsData }] = useSearchStudentsMutation();
  const { data: coursesData, isLoading: isLoadingCourses } = useFilterCoursesQuery(filterParams);

  useEffect(() => {
    searchStudents({});
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      mandatory: false,
    },
  });

  const onSubmit = async (data: CreateCourseFormData) => {
    try {
      await createCourse(data).unwrap();
      reset();
      alert('Course created successfully!');
    } catch (error) {
      alert('Failed to create course. Please try again.');
    }
  };

  const handleFilterChange = (field: 'student_id' | 'teacher_id', value: string) => {
    setFilterParams(prev => ({
      ...prev,
      [field]: value ? Number(value) : undefined,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Course Management</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="grade_level" className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level (1-12)
            </label>
            <input
              id="grade_level"
              type="number"
              min="1"
              max="12"
              {...register('grade_level', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.grade_level && (
              <p className="text-red-500 text-sm mt-1">{errors.grade_level.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
              Teacher
            </label>
            <select
              id="teacher_id"
              {...register('teacher_id', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingTeachers}
            >
              <option value="">Select a teacher</option>
              {teachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {formatFullName(teacher?.first_name, teacher?.last_name, teacher?.patronym)}
                </option>
              ))}
            </select>
            {errors.teacher_id && (
              <p className="text-red-500 text-sm mt-1">{errors.teacher_id.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="mandatory"
              type="checkbox"
              {...register('mandatory')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="mandatory" className="ml-2 block text-sm text-gray-700">
              Mandatory Course
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Filter Courses</h2>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="filter_student" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Student
            </label>
            <select
              id="filter_student"
              value={filterParams.student_id || ''}
              onChange={(e) => handleFilterChange('student_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Students</option>
              {studentsData?.students.map((student) => (
                <option key={student.id} value={student.id}>
                  {formatFullName(student.first_name, student.last_name, student.patronym || '')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="filter_teacher" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Teacher
            </label>
            <select
              id="filter_teacher"
              value={filterParams.teacher_id || ''}
              onChange={(e) => handleFilterChange('teacher_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingTeachers}
            >
              <option value="">All Teachers</option>
              {teachers?.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {formatFullName(teacher.first_name, teacher.last_name, teacher.patronym)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoadingCourses && <div className="text-center py-4">Loading courses...</div>}
        
        {coursesData && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Courses ({coursesData.courses.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Grade Level</th>
                    <th className="p-3 text-left">Mandatory</th>
                    <th className="p-3 text-left">Teacher</th>
                    <th className="p-3 text-left">Enrollments</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesData.courses.map((course) => (
                    <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{course.id}</td>
                      <td className="p-3 font-medium">{course.name}</td>
                      <td className="p-3">{course.description || '-'}</td>
                      <td className="p-3">{course.grade_level || '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          course.mandatory 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.mandatory ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-3">
                        {course.teacher 
                          ? formatFullName(course.teacher.first_name, course.teacher.last_name)
                          : '-'
                        }
                      </td>
                      <td className="p-3">{course.enrollment_count}</td>
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

export default AdminCourses;
