import { baseApi } from '../../api/baseApi';
import type {
  CreateSubmissionFeedbackRequestDto,
  CreateSubmissionFeedbackResponseDto,
  UpdateSubmissionFeedbackRequestDto,
  UpdateSubmissionFeedbackResponseDto,
  UpdateSubmissionFeedbackParams,
  GetFeedbacksBySubmissionRequestDto,
  GetFeedbacksBySubmissionResponseDto,
  GetStudentFeedbacksInRangeRequestDto,
  GetStudentFeedbacksInRangeResponseDto,
  DeleteSubmissionFeedbackParams,
  DeleteSubmissionFeedbackResponseDto,
} from './types';

const endpointsUrl = {
  createFeedback: () => `/submissionFeedbacks/`,
  updateFeedback: (id: number) => `/submissionFeedbacks/${id}`,
  getFeedbacksBySubmission: (submissionId: number) =>
    `/submissionFeedbacks/submission/${submissionId}`,
  getStudentFeedbacksInRange: (params: GetStudentFeedbacksInRangeRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('student_id', params.student_id.toString());
    searchParams.append('start_date', params.start_date);
    searchParams.append('end_date', params.end_date);
    if (params.course_id !== undefined) {
      searchParams.append('course_id', params.course_id.toString());
    }
    return `/submissionFeedbacks/student-range?${searchParams.toString()}`;
  },
  deleteFeedback: (id: number) => `/submissionsFeedback/${id}`,
} as const;

export const submissionFeedbacksApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    createSubmissionFeedback: create.mutation<
      CreateSubmissionFeedbackResponseDto,
      CreateSubmissionFeedbackRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createFeedback(),
        method: 'POST',
        body,
      }),
    }),
    updateSubmissionFeedback: create.mutation<
      UpdateSubmissionFeedbackResponseDto,
      UpdateSubmissionFeedbackParams & { body: UpdateSubmissionFeedbackRequestDto }
    >({
      query: ({ id, body }) => ({
        url: endpointsUrl.updateFeedback(id),
        method: 'PUT',
        body,
      }),
    }),
    getFeedbacksBySubmission: create.query<
      GetFeedbacksBySubmissionResponseDto,
      GetFeedbacksBySubmissionRequestDto
    >({
      query: (params) => endpointsUrl.getFeedbacksBySubmission(params.submissionId),
    }),
    getStudentFeedbacksInRange: create.query<
      GetStudentFeedbacksInRangeResponseDto,
      GetStudentFeedbacksInRangeRequestDto
    >({
      query: (params) => endpointsUrl.getStudentFeedbacksInRange(params),
    }),
    deleteSubmissionFeedback: create.mutation<
      DeleteSubmissionFeedbackResponseDto,
      DeleteSubmissionFeedbackParams
    >({
      query: ({ id }) => ({
        url: endpointsUrl.deleteFeedback(id),
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateSubmissionFeedbackMutation,
  useUpdateSubmissionFeedbackMutation,
  useGetFeedbacksBySubmissionQuery,
  useGetStudentFeedbacksInRangeQuery,
  useDeleteSubmissionFeedbackMutation,
} = submissionFeedbacksApi;
