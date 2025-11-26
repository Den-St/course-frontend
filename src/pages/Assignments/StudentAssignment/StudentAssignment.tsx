import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetAssignmentsForStudentGroupQuery } from '../api';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';
import { useFilterSubmissionsMutation, useCreateSubmissionMutation, useEditSubmissionMutation } from '../../Submissions/api';
import { createSubmissionSchema, type CreateSubmissionFormData, editSubmissionSchema, type EditSubmissionFormData } from '../../Submissions/schemas';

const StudentAssignment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: userData } = useGetMe();
  const user = userData?.data;

  const { data: assignmentsData, isLoading, error } = useGetAssignmentsForStudentGroupQuery(
    { student_id: user?.student_id || 0 },
    { skip: !user?.student_id }
  );

  const [filterSubmissions, { data: submissionsData, isLoading: isLoadingSubmission }] = useFilterSubmissionsMutation();
  const [createSubmission, { isLoading: isCreatingSubmission }] = useCreateSubmissionMutation();
  const [editSubmission, { isLoading: isEditingSubmission }] = useEditSubmissionMutation();

  const assignment = useMemo(() => {
    if (!assignmentsData?.data || !id) return null;
    return assignmentsData.data.find(a => a.id === Number(id));
  }, [assignmentsData, id]);

  const submission = useMemo(() => {
    if (!submissionsData?.data || !user?.student_id) return null;
    return submissionsData.data.find(s => s.student_id === user.student_id);
  }, [submissionsData, user?.student_id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSubmissionFormData>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: {
      content: '',
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm<EditSubmissionFormData>({
    resolver: zodResolver(editSubmissionSchema),
  });

  useEffect(() => {
    if (id) {
      filterSubmissions({ assignment_id: Number(id) });
    }
  }, [id, filterSubmissions]);

  const onSubmit = async (data: CreateSubmissionFormData) => {
    if (!user?.student_id || !id) {
      console.error('Missing user ID or assignment ID');
      return;
    }

    const dueDate = assignment?.due_date ? new Date(assignment.due_date) : new Date();
    const now = new Date();
    const isLate = now > dueDate;

    try {
      await createSubmission({
        assignment_id: Number(id),
        student_id: user.student_id,
        content: data.content,
        is_late: isLate,
        feedback_given: false,
      }).unwrap();
      
      reset();
      setShowSubmissionForm(false);
      filterSubmissions({ assignment_id: Number(id) });
    } catch (err) {
      console.error('Failed to create submission:', err);
    }
  };

  const onEdit = async (data: EditSubmissionFormData) => {
    try {
      await editSubmission(data).unwrap();
      
      resetEdit();
      setIsEditMode(false);
      filterSubmissions({ assignment_id: Number(id) });
    } catch (err) {
      console.error('Failed to edit submission:', err);
    }
  };

  const handleEditClick = () => {
    if (submission) {
      setValueEdit('submission_id', submission.id);
      setValueEdit('content', submission.content || '');
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    resetEdit();
  };

  if (isLoading || isLoadingSubmission) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600">Error loading assignment details</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            ← Back to Assignments
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Assignment not found</p>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(assignment.due_date) < new Date();

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          ← Back to Assignments
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Assignment Details</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Assignment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <p className="text-gray-900 text-lg font-semibold">{assignment.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment ID
              </label>
              <p className="text-gray-900">{assignment.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Date
              </label>
              <p className="text-gray-900">
                {new Date(assignment.assign_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="flex items-center gap-2">
                <p className="text-gray-900">
                  {new Date(assignment.due_date).toLocaleString()}
                </p>
                {isOverdue && (
                  <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </div>
            </div>
            {assignment.max_grade && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Grade
                </label>
                <p className="text-gray-900">{assignment.max_grade}</p>
              </div>
            )}
            {assignment.course && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <p className="text-gray-900">{assignment.course.name}</p>
              </div>
            )}
            {assignment.teacher && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <p className="text-gray-900">
                  {assignment.teacher.first_name} {assignment.teacher.last_name}
                  {assignment.teacher.patronym && ` ${assignment.teacher.patronym}`}
                </p>
              </div>
            )}
            {assignment.description && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">{assignment.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Submission Section */}
        {submission ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Submission</h2>
              {!submission.grade && submission.content && !isEditMode && (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Submission
                </button>
              )}
            </div>

            {isEditMode ? (
              <form onSubmit={handleSubmitEdit(onEdit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submission Content
                  </label>
                  <textarea
                    {...registerEdit('content')}
                    rows={8}
                    placeholder="Enter your submission content here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errorsEdit.content && (
                    <p className="text-red-600 text-sm mt-1">
                      {errorsEdit.content.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isEditingSubmission}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isEditingSubmission ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submitted At
                  </label>
                  <p className="text-gray-900">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      submission.is_late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {submission.is_late ? 'Late' : 'On Time'}
                    </span>
                    {submission.feedback_given && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Feedback Received
                      </span>
                    )}
                  </div>
                </div>
                {submission.content && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                      {submission.content}
                    </p>
                  </div>
                )}
                {submission.grade && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade
                    </label>
                    <p className="text-gray-900 text-2xl font-bold">
                      {submission.grade.grade_value}
                    </p>
                  </div>
                )}
                {submission.submissionFeedback && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                      {submission.submissionFeedback.feedback_text}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Submit Assignment</h2>
              {!showSubmissionForm && (
                <button
                  onClick={() => setShowSubmissionForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Submission
                </button>
              )}
            </div>

            {showSubmissionForm ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submission Content
                  </label>
                  <textarea
                    {...register('content')}
                    rows={8}
                    placeholder="Enter your submission content here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.content && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                {isOverdue && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ This assignment is overdue. Your submission will be marked as late.
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isCreatingSubmission}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isCreatingSubmission ? 'Submitting...' : 'Submit Assignment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionForm(false);
                      reset();
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600">
                You haven't submitted this assignment yet. Click "Create Submission" to get started.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;
