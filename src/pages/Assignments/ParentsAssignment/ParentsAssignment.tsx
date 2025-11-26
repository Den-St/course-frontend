import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useGetMe } from '../../../api/authMe/hooks/useGetMe';
import { useFilterAssignmentsQuery } from '../api';
import { useFilterSubmissionsMutation } from '../../Submissions/api';
import { useGetFeedbacksBySubmissionQuery } from '../../AssignmentFeedbacks/api';

const ParentsAssignment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: parentUserData } = useGetMe();
  const registeredChildren = parentUserData?.data?.children || [];

  const { data: assignmentsList, isLoading: loadingAssignment, error: assignmentLoadError } = useFilterAssignmentsQuery(
    { assignment_id: Number(id) },
    { skip: !id }
  );

  const [fetchSubmissions, { data: submissionsResponse, isLoading: loadingSubmission }] = useFilterSubmissionsMutation();

  const assignmentRecord = useMemo(() => {
    if (!assignmentsList?.data || !id) return null;
    return assignmentsList.data.find(item => item.id === Number(id));
  }, [assignmentsList, id]);

  const childAssignmentSubmission = useMemo(() => {
    if (!submissionsResponse?.data || registeredChildren.length === 0) return null;
    const childrenIdSet = registeredChildren.map(c => c.id);
    return submissionsResponse.data.find(sub => childrenIdSet.includes(sub.student_id));
  }, [submissionsResponse, registeredChildren]);

  const { data: feedbackCollection } = useGetFeedbacksBySubmissionQuery(
    { submissionId: childAssignmentSubmission?.id || 0 },
    { skip: !childAssignmentSubmission?.id }
  );

  const teacherProvidedFeedback = feedbackCollection?.data?.[0];

  useEffect(() => {
    if (id) {
      fetchSubmissions({ assignment_id: Number(id) });
    }
  }, [id, fetchSubmissions]);

  const assignmentScore = childAssignmentSubmission?.grade;
  const isDeadlineExpired = assignmentRecord ? new Date(assignmentRecord.due_date) < new Date() : false;

  if (loadingAssignment || loadingSubmission) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading assignment data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (assignmentLoadError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
          <p className="text-red-700 font-medium">Could not retrieve assignment information</p>
        </div>
      </div>
    );
  }

  if (!assignmentRecord) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-5">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600 text-lg">Assignment record not found in system</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Assignments List</span>
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-gray-900">Assignment Review</h1>

      <div className="space-y-6">
        {/* Assignment Core Information */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200 p-6">
          <div className="border-b-2 border-gray-200 pb-4 mb-5">
            <h2 className="text-2xl font-bold text-gray-800">Assignment Details</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Assignment Name
              </label>
              <p className="text-xl font-bold text-gray-900">{assignmentRecord.title}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Record ID
              </label>
              <p className="text-gray-900 font-mono">#{assignmentRecord.id}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Date Assigned
              </label>
              <p className="text-gray-900">
                {new Date(assignmentRecord.assign_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Due By
              </label>
              <div className="flex items-center gap-3">
                <p className="text-gray-900">
                  {new Date(assignmentRecord.due_date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {isDeadlineExpired && (
                  <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 font-bold border border-red-200">
                    OVERDUE
                  </span>
                )}
              </div>
            </div>
            {assignmentRecord.max_grade && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Maximum Points
                </label>
                <p className="text-gray-900 font-bold text-2xl text-blue-600">{assignmentRecord.max_grade}</p>
              </div>
            )}
            {assignmentRecord.course && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Course Title
                </label>
                <p className="text-gray-900 font-medium">{assignmentRecord.course.name}</p>
              </div>
            )}
            {assignmentRecord.teacher && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Teaching Staff
                </label>
                <p className="text-gray-900">
                  {assignmentRecord.teacher.first_name} {assignmentRecord.teacher.last_name}
                  {assignmentRecord.teacher.patronym && ` ${assignmentRecord.teacher.patronym}`}
                </p>
              </div>
            )}
            {assignmentRecord.description && (
              <div className="lg:col-span-2 space-y-3">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Assignment Instructions
                </label>
                <div className="bg-white p-5 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {assignmentRecord.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Student Submission Section */}
        {childAssignmentSubmission ? (
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md border border-blue-200 p-6">
            <div className="border-b-2 border-blue-200 pb-4 mb-5">
              <h2 className="text-2xl font-bold text-gray-800">Student Submission</h2>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Submitted On
                  </label>
                  <p className="text-gray-900">
                    {new Date(childAssignmentSubmission.submitted_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Status Indicators
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                      childAssignmentSubmission.is_late 
                        ? 'bg-orange-100 text-orange-800 border-orange-300' 
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {childAssignmentSubmission.is_late ? 'Late Submission' : 'On Time'}
                    </span>
                    {childAssignmentSubmission.feedback_given && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border-2 border-indigo-300">
                        Reviewed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {childAssignmentSubmission.content && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Submission Content
                  </label>
                  <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {childAssignmentSubmission.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Grade Section */}
              {assignmentScore && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Received Grade</span>
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <div className="text-5xl font-extrabold text-blue-700">
                      {assignmentScore.grade_value}
                    </div>
                    <div className="text-2xl text-gray-600 font-medium">
                      / {assignmentRecord.max_grade}
                    </div>
                    <div className="ml-4 text-sm text-gray-600">
                      ({Math.round((assignmentScore.grade_value / assignmentRecord.max_grade) * 100)}%)
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              {teacherProvidedFeedback && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>Instructor Feedback</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed italic">
                        "{teacherProvidedFeedback.feedback_text}"
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">
                          {teacherProvidedFeedback.teacher.first_name} {teacherProvidedFeedback.teacher.last_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {new Date(teacherProvidedFeedback.feedback_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-2">No Submission Yet</h3>
                <p className="text-amber-800">
                  Your child has not submitted this assignment yet.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentsAssignment;
