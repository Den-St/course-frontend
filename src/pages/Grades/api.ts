import { baseApi } from '../../api/baseApi';
import type {
  CreateGradeRequestDto,
  CreateGradeResponseDto,
  UpdateGradeRequestDto,
  UpdateGradeResponseDto,
  UpdateGradeParams,
  GetGroupAverageGradeRequestDto,
  GetGroupAverageGradeResponseDto,
  GetStudentGradesInRangeRequestDto,
  GetStudentGradesInRangeResponseDto,
} from './types';

const endpointsUrl = {
  createGrade: () => `/grades/`,
  updateGrade: (id: number) => `/grades/${id}`,
  getGroupAverageGrade: (params: GetGroupAverageGradeRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('group_id', params.group_id.toString());
    searchParams.append('start_date', params.start_date);
    searchParams.append('end_date', params.end_date);
    return `/grades/group-average?${searchParams.toString()}`;
  },
  getStudentGradesInRange: (params: GetStudentGradesInRangeRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('student_id', params.student_id.toString());
    searchParams.append('start_date', params.start_date);
    searchParams.append('end_date', params.end_date);
    return `/grades/student-range?${searchParams.toString()}`;
  },
} as const;

export const gradesApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    createGrade: create.mutation<
      CreateGradeResponseDto,
      CreateGradeRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createGrade(),
        method: 'POST',
        body,
      }),
    }),
    updateGrade: create.mutation<
      UpdateGradeResponseDto,
      UpdateGradeParams & { body: UpdateGradeRequestDto }
    >({
      query: ({ id, body }) => ({
        url: endpointsUrl.updateGrade(id),
        method: 'PUT',
        body,
      }),
    }),
    getGroupAverageGrade: create.query<
      GetGroupAverageGradeResponseDto,
      GetGroupAverageGradeRequestDto
    >({
      query: (params) => endpointsUrl.getGroupAverageGrade(params),
    }),
    getStudentGradesInRange: create.query<
      GetStudentGradesInRangeResponseDto,
      GetStudentGradesInRangeRequestDto
    >({
      query: (params) => endpointsUrl.getStudentGradesInRange(params),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useGetGroupAverageGradeQuery,
  useGetStudentGradesInRangeQuery,
} = gradesApi;
