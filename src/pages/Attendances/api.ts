import { baseApi } from '../../api/baseApi';
import type {
  FindAttendanceRequestDto,
  FindAttendanceResponseDto,
  CreateAttendanceRequestDto,
  CreateAttendanceResponseDto,
} from './types';

const endpointsUrl = {
  findAttendances: (params: FindAttendanceRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.group_id !== undefined) {
      searchParams.append('group_id', params.group_id.toString());
    }
    if (params.student_id !== undefined) {
      searchParams.append('student_id', params.student_id.toString());
    }
    if (params.lesson_id !== undefined) {
      searchParams.append('lesson_id', params.lesson_id.toString());
    }
    if (params.course_id !== undefined) {
      searchParams.append('course_id', params.course_id.toString());
    }
    if (params.start_date) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date) {
      searchParams.append('end_date', params.end_date);
    }
    return `/attendances?${searchParams.toString()}`;
  },
  createAttendance: () => `/attendances/create`,
} as const;

export const attendancesApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    findAttendances: create.query<
      FindAttendanceResponseDto,
      FindAttendanceRequestDto
    >({
      query: (params) => endpointsUrl.findAttendances(params),
    }),
    createAttendance: create.mutation<
      CreateAttendanceResponseDto,
      CreateAttendanceRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createAttendance(),
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useFindAttendancesQuery,
  useCreateAttendanceMutation,
} = attendancesApi;
