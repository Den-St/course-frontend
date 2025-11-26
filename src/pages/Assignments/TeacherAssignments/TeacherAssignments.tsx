import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetMeQuery } from '../../../api/authMe/api';
import { useCreateAssignmentMutation, useFilterAssignmentsQuery, useUpdateAssignmentMutation } from '../api';
import { createAssignmentSchema, updateAssignmentSchema, type CreateAssignmentFormData, type UpdateAssignmentFormData } from '../schemas';
import { useFilterCoursesQuery } from '../../Courses/api';
import type { AssignmentResponseDto } from '../types/types';

const TeacherAssignments: FC = () => {
  const { data: userData } = useGetMeQuery();
  const user = userData?.data;
  const teacherId = user?.id;

  const [filterParams, setFilterParams] = useState<{
    course_id?: number;
    start_date?: string;
    end_date?: string;
  }>({});

  const [editingAssignment, setEditingAssignment] = useState<AssignmentResponseDto | null>(null);

  const [createAssignment, { isLoading, isSuccess, isError, error }] = useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateAssignmentMutation();
  const { data: coursesData, isLoading: isLoadingCourses } = useFilterCoursesQuery({});
  const { data: assignments, isLoading: isLoadingAssignments } = useFilterAssignmentsQuery(
    { teacher_id: teacherId, ...filterParams },
    { skip: !teacherId }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAssignmentFormData>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      teacher_id: user?.id,
    },
  });

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<UpdateAssignmentFormData>({
    resolver: zodResolver(updateAssignmentSchema),
  });

  const onSubmit = async (data: CreateAssignmentFormData) => {
    try {
      await createAssignment({
        ...data,
        teacher_id: user?.id || data.teacher_id || 0,
      }).unwrap();
      reset({
        teacher_id: user?.id,
      });
    } catch (err) {
      console.error('Failed to create assignment:', err);
    }
  };

  const onUpdate = async (data: UpdateAssignmentFormData) => {
    if (!editingAssignment) return;

    try {
      await updateAssignment({
        id: editingAssignment.id,
        body: data,
      }).unwrap();
      setEditingAssignment(null);
      resetUpdate();
    } catch (err) {
      console.error('Failed to update assignment:', err);
    }
  };

  const handleEdit = (assignment: AssignmentResponseDto) => {
    setEditingAssignment(assignment);
    resetUpdate({
      course_id: assignment.course_id ?? undefined,
      teacher_id: assignment.teacher_id ?? undefined,
      title: assignment.title,
      description: assignment.description ?? undefined,
      assign_date: assignment.assign_date ? new Date(assignment.assign_date).toISOString().split('T')[0] : undefined,
      due_date: new Date(assignment.due_date).toISOString().split('T')[0],
      max_grade: assignment.max_grade,
    });
  };

  const handleCancelEdit = () => {
    setEditingAssignment(null);
    resetUpdate();
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
      <h1 className="text-3xl font-bold mb-8">Teacher Assignments</h1>
      
      {editingAssignment ? (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Edit Assignment</h2>
            <button
              onClick={handleCancelEdit}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕ Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmitUpdate(onUpdate)} className="space-y-4">
            <div>
              <label htmlFor="edit_course_id" className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                id="edit_course_id"
                {...registerUpdate('course_id', { valueAsNumber: true })}
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
              {errorsUpdate.course_id && (
                <p className="mt-1 text-sm text-red-600">{errorsUpdate.course_id.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit_title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="edit_title"
                type="text"
                {...registerUpdate('title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter assignment title"
              />
              {errorsUpdate.title && (
                <p className="mt-1 text-sm text-red-600">{errorsUpdate.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit_description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="edit_description"
                {...registerUpdate('description')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter assignment description (optional)"
              />
              {errorsUpdate.description && (
                <p className="mt-1 text-sm text-red-600">{errorsUpdate.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit_assign_date" className="block text-sm font-medium text-gray-700 mb-1">
                Assign Date
              </label>
              <input
                id="edit_assign_date"
                type="date"
                {...registerUpdate('assign_date')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errorsUpdate.assign_date && (
                <p className="mt-1 text-sm text-red-600">{errorsUpdate.assign_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit_due_date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="edit_due_date"
                type="date"
                {...registerUpdate('due_date')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errorsUpdate.due_date && (
                <p className="mt-1 text-sm text-red-600">{errorsUpdate.due_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit_max_grade" className="block text-sm font-medium text-gray-700 mb-1">
                Max Grade
              </label>
              <input
                id="edit_max_grade"
                type="number"
                step="0.01"
                {...registerUpdate('max_grade', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter maximum grade (optional)"
              />
              {errorsUpdate.max_grade && (
                <p className="mt-1 text-sm text-red-600">{errorsUpdate.max_grade.message}</p>
              )}
            </div>

            {isUpdateSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                Assignment updated successfully!
              </div>
            )}

            {isUpdateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Error updating assignment: {updateError && 'data' in updateError ? JSON.stringify(updateError.data) : 'Unknown error'}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Updating...' : 'Update Assignment'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mb-6">
          <h2 className="text-2xl font-semibold mb-6">Create New Assignment</h2>
          
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter assignment title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter assignment description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="assign_date" className="block text-sm font-medium text-gray-700 mb-1">
                Assign Date
              </label>
              <input
                id="assign_date"
                type="date"
                {...register('assign_date')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.assign_date && (
                <p className="mt-1 text-sm text-red-600">{errors.assign_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                id="due_date"
                type="date"
                {...register('due_date')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              {errors.due_date && (
                <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="max_grade" className="block text-sm font-medium text-gray-700 mb-1">
                Max Grade
              </label>
              <input
                id="max_grade"
                type="number"
                step="0.01"
                {...register('max_grade', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Enter maximum grade (optional)"
              />
              {errors.max_grade && (
                <p className="mt-1 text-sm text-red-600">{errors.max_grade.message}</p>
              )}
            </div>

            {isSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                Assignment created successfully!
              </div>
            )}

            {isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                Error creating assignment: {error && 'data' in error ? JSON.stringify(error.data) : 'Unknown error'}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Assignment'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Filter Assignments</h2>
        
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

        {isLoadingAssignments && <div className="text-center py-4">Loading assignments...</div>}
        
        {assignments && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Assignments ({assignments.data.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Course</th>
                    <th className="p-3 text-left">Assign Date</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Max Grade</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.data.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">{assignment.id}</td>
                      <td className="p-3 font-medium">{assignment.title}</td>
                      <td className="p-3">{assignment.course?.name || '-'}</td>
                      <td className="p-3">{formatDate(assignment.assign_date)}</td>
                      <td className="p-3">{formatDate(assignment.due_date)}</td>
                      <td className="p-3">{assignment.max_grade}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
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
    </div>
  );
};

export default TeacherAssignments;
