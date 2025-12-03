import { baseApi } from '../../api/baseApi';
import type {
  CreateAssignmentRequestDto,
  CreateAssignmentResponseDto,
  UpdateAssignmentRequestDto,
  UpdateAssignmentResponseDto,
  UpdateAssignmentParams,
  GetAssignmentsForStudentGroupRequestDto,
  StudentGroupAssignmentsResponseDto,
  GetAssignmentsFilterRequestDto,
  AssignmentResponseDto,
} from './types/types';

const endpointsUrl = {
  createAssignment: () => `/assignments/create`,
  updateAssignment: (id: number) => `/assignments/update/${id}`,
  getAssignmentsForStudentGroup: (params: GetAssignmentsForStudentGroupRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('student_id', params.student_id.toString());
    if (params.start_date !== undefined) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date !== undefined) {
      searchParams.append('end_date', params.end_date);
    }
    if (params.course_id !== undefined) {
      searchParams.append('course_id', params.course_id.toString());
    }
    return `/assignments/student-group?${searchParams.toString()}`;
  },
  filterAssignments: (params: GetAssignmentsFilterRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.teacher_id !== undefined) {
      searchParams.append('teacher_id', params.teacher_id.toString());
    }
    if (params.course_id !== undefined) {
      searchParams.append('course_id', params.course_id.toString());
    }
    if (params.assignment_id !== undefined) {
      searchParams.append('assignment_id', params.assignment_id.toString());
    }
    if (params.start_date !== undefined) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date !== undefined) {
      searchParams.append('end_date', params.end_date);
    }
    return `/assignments/filter?${searchParams.toString()}`;
  },
} as const;

export const assignmentsApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    createAssignment: create.mutation<
      CreateAssignmentResponseDto,
      CreateAssignmentRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createAssignment(),
        method: 'POST',
        body,
      }),
    }),
    updateAssignment: create.mutation<
      UpdateAssignmentResponseDto,
      UpdateAssignmentParams & { body: UpdateAssignmentRequestDto }
    >({
      query: ({ id, body }) => ({
        url: endpointsUrl.updateAssignment(id),
        method: 'PUT',
        body,
      }),
    }),
    getAssignmentsForStudentGroup: create.query<
      {data: StudentGroupAssignmentsResponseDto[]},
      GetAssignmentsForStudentGroupRequestDto
    >({
      query: (params) => endpointsUrl.getAssignmentsForStudentGroup(params),
    }),
    filterAssignments: create.query<
      {data: AssignmentResponseDto[]},
      GetAssignmentsFilterRequestDto
    >({
      query: (params) => endpointsUrl.filterAssignments(params),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useGetAssignmentsForStudentGroupQuery,
  useFilterAssignmentsQuery,
} = assignmentsApi;
