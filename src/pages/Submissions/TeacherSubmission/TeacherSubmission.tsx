import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFilterSubmissionsMutation } from '../api';
import {
  useCreateSubmissionFeedbackMutation,
  useUpdateSubmissionFeedbackMutation,
  useGetFeedbacksBySubmissionQuery,
} from '../../AssignmentFeedbacks/api';
import {
  useCreateGradeMutation,
  useUpdateGradeMutation,
} from '../../Grades/api';
import {
  updateSubmissionFeedbackSchema,
  type UpdateSubmissionFeedbackFormData,
} from '../../AssignmentFeedbacks/schemas';
import {
  updateGradeSchema,
  type UpdateGradeFormData,
} from '../../Grades/schemas';
import { useGetMeQuery } from '../../../api/authMe/api';

const TeacherSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const [isEditingGrade, setIsEditingGrade] = useState(false);

  const { data: userData } = useGetMeQuery();
  const user = userData?.data;
  const [filterSubmissions, { data: submissionsData, isLoading, error }] = useFilterSubmissionsMutation();
  const { data: feedbacksData, refetch: refetchFeedbacks } = useGetFeedbacksBySubmissionQuery(
    { submissionId: Number(id) },
    { skip: !id }
  );
  console.log('filterSubmissions',submissionsData);
  const [createFeedback, { isLoading: isCreatingFeedback }] = useCreateSubmissionFeedbackMutation();
  const [updateFeedback, { isLoading: isUpdatingFeedback }] = useUpdateSubmissionFeedbackMutation();
  const [createGrade, { isLoading: isCreatingGrade }] = useCreateGradeMutation();
  const [updateGrade, { isLoading: isUpdatingGrade }] = useUpdateGradeMutation();

  const submission = submissionsData?.data?.[0];
  const existingFeedback = submissionsData?.data?.[0]?.submissionFeedback;
  const existingGrade = submission?.grade;

  const {
    register: registerFeedback,
    handleSubmit: handleSubmitFeedback,
    formState: { errors: feedbackErrors },
    reset: resetFeedback,
  } = useForm<UpdateSubmissionFeedbackFormData>({
    resolver: zodResolver(updateSubmissionFeedbackSchema),
    defaultValues: {
      feedback_text: existingFeedback?.feedback_text || '',
    },
  });

  const {
    register: registerGrade,
    handleSubmit: handleSubmitGrade,
    formState: { errors: gradeErrors },
    reset: resetGrade,
  } = useForm<UpdateGradeFormData>({
    resolver: zodResolver(updateGradeSchema),
    defaultValues: {
      grade: existingGrade?.grade_value || undefined,
    },
  });

  useEffect(() => {
    if (id) {
      filterSubmissions({ submission_id: Number(id) });
    }
  }, [id, filterSubmissions]);

  useEffect(() => {
    if (existingFeedback) {
      resetFeedback({ feedback_text: existingFeedback.feedback_text });
    } else {
      resetFeedback({ feedback_text: '' });
    }
  }, [existingFeedback, resetFeedback]);

  useEffect(() => {
    if (existingGrade) {
      resetGrade({
        grade: existingGrade.grade_value || undefined,
      });
    } else {
      resetGrade({ grade: undefined });
    }
  }, [existingGrade, resetGrade]);

  const onSubmitFeedback = async (data: UpdateSubmissionFeedbackFormData) => {
    try {
      if (existingFeedback) {
        await updateFeedback({
          id: existingFeedback.id,
          body: data,
        }).unwrap();
        setIsEditingFeedback(false);
      } else {
        if (!user?.id || !id) {
          console.error('Missing user ID or submission ID');
          return;
        }
        await createFeedback({
          submission_id: Number(id),
          teacher_id: user.id,
          feedback_text: data.feedback_text || '',
        }).unwrap();
      }
      refetchFeedbacks();
      if (!existingFeedback) {
        resetFeedback({ feedback_text: '' });
      }
    } catch (err) {
      console.error('Failed to save feedback:', err);
    }
  };

  const onSubmitGrade = async (data: UpdateGradeFormData) => {
    try {
      if (existingGrade) {
        await updateGrade({
          id: existingGrade.id,
          body: data,
        }).unwrap();
        setIsEditingGrade(false);
      } else {
        if (!id) {
          console.error('Missing submission ID');
          return;
        }
        await createGrade({
          submission_id: Number(id),
          grade: data.grade,
        }).unwrap();
      }
      filterSubmissions({ submission_id: Number(id) });
      if (!existingGrade) {
        resetGrade({ grade: undefined });
      }
    } catch (err) {
      console.error('Failed to save grade:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          ← Back to Submissions
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Submission Details #{id}</h1>

      {isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading submission...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-red-600">Error loading submission details</p>
        </div>
      )}

      {!isLoading && !submission && !error && (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Submission not found</p>
        </div>
      )}

      {submission && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Assignment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title
                </label>
                <p className="text-gray-900">{submission.assignment.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment ID
                </label>
                <p className="text-gray-900">{submission.assignment.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <p className="text-gray-900">
                  {new Date(submission.assignment.due_date).toLocaleString()}
                </p>
              </div>
              {submission.assignment.description && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900">{submission.assignment.description}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <p className="text-gray-900">
                  {submission.student.first_name} {submission.student.last_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{submission.student.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <p className="text-gray-900">{submission.student.id}</p>
              </div>
              {submission.student.group_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group ID
                  </label>
                  <p className="text-gray-900">{submission.student.group_id}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Submission Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submission ID
                </label>
                <p className="text-gray-900">{submission.id}</p>
              </div>
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
                      Feedback Given
                    </span>
                  )}
                </div>
              </div>
              {submission.content && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">{submission.content}</p>
                </div>
              )}
            </div>
          </div>

          {/* Grade Section */}
          {existingGrade ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Grade</h2>
                {!isEditingGrade && (
                  <button
                    onClick={() => setIsEditingGrade(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Grade
                  </button>
                )}
              </div>

              {isEditingGrade ? (
                <form onSubmit={handleSubmitGrade(onSubmitGrade)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade (0-100)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...registerGrade('grade', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {gradeErrors.grade && (
                      <p className="text-red-600 text-sm mt-1">
                        {gradeErrors.grade.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isUpdatingGrade}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isUpdatingGrade ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingGrade(false);
                        resetGrade({
                          grade: existingGrade.grade_value || undefined,
                        });
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade
                    </label>
                    <p className="text-gray-900 text-2xl font-bold">
                      {existingGrade.grade_value ?? 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Given
                    </label>
                    <p className="text-gray-900">
                      {new Date(existingGrade.grade_value).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add Grade</h2>
              <form onSubmit={handleSubmitGrade(onSubmitGrade)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade (0-100)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...registerGrade('grade', { valueAsNumber: true })}
                    placeholder="Enter grade..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {gradeErrors.grade && (
                    <p className="text-red-600 text-sm mt-1">
                      {gradeErrors.grade.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isCreatingGrade}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isCreatingGrade ? 'Adding...' : 'Add Grade'}
                </button>
              </form>
            </div>
          )}

          {/* Feedback Section */}
          {existingFeedback ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Feedback</h2>
                {!isEditingFeedback && (
                  <button
                    onClick={() => setIsEditingFeedback(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Feedback
                  </button>
                )}
              </div>

              {isEditingFeedback ? (
                <form onSubmit={handleSubmitFeedback(onSubmitFeedback)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback Text
                    </label>
                    <textarea
                      {...registerFeedback('feedback_text')}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {feedbackErrors.feedback_text && (
                      <p className="text-red-600 text-sm mt-1">
                        {feedbackErrors.feedback_text.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isUpdatingFeedback}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isUpdatingFeedback ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingFeedback(false);
                        resetFeedback({ feedback_text: existingFeedback.feedback_text });
                      }}
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
                      Feedback Text
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {existingFeedback.feedback_text}
                    </p>
                  </div>
                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provided By
                    </label>
                    <p className="text-gray-900">
                      {submission..teacher.first_name} {existingFeedback.teacher.last_name}
                    </p> */}
                  </div>
                  <div>
                    {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(existingFeedback.feedback_date).toLocaleString()}
                    </p> */}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Provide Feedback</h2>
              <form onSubmit={handleSubmitFeedback(onSubmitFeedback)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback Text
                  </label>
                  <textarea
                    {...registerFeedback('feedback_text')}
                    rows={6}
                    placeholder="Enter your feedback for this submission..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {feedbackErrors.feedback_text && (
                    <p className="text-red-600 text-sm mt-1">
                      {feedbackErrors.feedback_text.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isCreatingFeedback}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isCreatingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherSubmission;
