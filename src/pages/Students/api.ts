import { baseApi } from '../../api/baseApi';
import type {
  SearchStudentRequestDto,
  StudentListResponseDto,
  UpdateStudentRequestDto,
  UpdateStudentResponseDto,
  UpdateStudentParams,
  GetStudentsByTeacherEnrollmentsRequestDto,
  GetStudentsByTeacherEnrollmentsResponseDto,
} from './types/types';

const endpointsUrl = {
  searchStudents: '/students/search',
  updateStudent: (id: number) => `/students/${id}`,
  byTeacherEnrollments: (params: GetStudentsByTeacherEnrollmentsRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.teacher_id !== undefined) {
      searchParams.append('teacher_id', params.teacher_id.toString());
    }
    return `/students/by-teacher-enrollments?${searchParams.toString()}`;
  },
} as const;

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    searchStudents: create.mutation<
      StudentListResponseDto,
      SearchStudentRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.searchStudents,
        method: 'POST',
        body,
      }),
    }),
    updateStudent: create.mutation<
      UpdateStudentResponseDto,
      UpdateStudentParams & { body: UpdateStudentRequestDto }
    >({
      query: ({ id, body }) => ({
        url: endpointsUrl.updateStudent(id),
        method: 'PUT',
        body,
      }),
    }),
    filterStudentsByTeacherEnrollments: create.query<
      GetStudentsByTeacherEnrollmentsResponseDto,
      GetStudentsByTeacherEnrollmentsRequestDto
    >({
      query: (params) => endpointsUrl.byTeacherEnrollments(params),
    }),
  }),
  overrideExisting: true,
});

export const {
  useSearchStudentsMutation,
  useUpdateStudentMutation,
  useFilterStudentsByTeacherEnrollmentsQuery,
} = studentsApi;
