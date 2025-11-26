import { baseApi } from '../../api/baseApi';
import type {
  CreateTuitionFeeRequestDto,
  CreateTuitionFeeResponseDto,
  CreateTuitionFeeByGroupRequestDto,
  CreateTuitionFeeByGroupResponseDto,
  GetTuitionFeesByStudentInRangeRequestDto,
  GetTuitionFeesByStudentInRangeResponseDto,
  GetTuitionFeesByGroupRequestDto,
  GetTuitionFeesByGroupResponseDto,
  GetOverdueTuitionFeesRequestDto,
  GetOverdueTuitionFeesResponseDto,
  FilterTuitionFeesRequestDto,
  FilterTuitionFeesResponseDto,
} from './types';

const endpointsUrl = {
  createTuitionFee: () => `/tuitionFees/`,
  createTuitionFeeByGroup: () => `/tuitionFees/by-group`,
  getTuitionFeesByStudentInRange: (params: GetTuitionFeesByStudentInRangeRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('student_id', params.student_id.toString());
    if (params.start_date !== undefined) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date !== undefined) {
      searchParams.append('end_date', params.end_date);
    }
    return `/tuitionFees/student-range?${searchParams.toString()}`;
  },
  getTuitionFeesByGroup: (params: GetTuitionFeesByGroupRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('group_id', params.group_id.toString());
    if (params.start_date !== undefined) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date !== undefined) {
      searchParams.append('end_date', params.end_date);
    }
    return `/tuitionFees/group?${searchParams.toString()}`;
  },
  getOverdueTuitionFees: (params: GetOverdueTuitionFeesRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.group_id !== undefined) {
      searchParams.append('group_id', params.group_id.toString());
    }
    if (params.student_id !== undefined) {
      searchParams.append('student_id', params.student_id.toString());
    }
    if (params.start_date !== undefined) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date !== undefined) {
      searchParams.append('end_date', params.end_date);
    }
    return `/tuitionFees/overdue?${searchParams.toString()}`;
  },
  filterTuitionFees: (params: FilterTuitionFeesRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.student_id) {
      searchParams.append('student_id', params.student_id.toString());
    } 
    if (params.group_id) {
      searchParams.append('group_id', params.group_id.toString());
    }
    if (params.start_date) {
      searchParams.append('start_date', params.start_date);
    }
    if (params.end_date) {
      searchParams.append('end_date', params.end_date);
    }
    if (params.onlyOverdue !== undefined) {
      searchParams.append('onlyOverdue', params.onlyOverdue.toString());
    }
    return `/tuitionFees/filter?${searchParams.toString()}`;
  },
} as const;

export const tuitionFeesApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    createTuitionFee: create.mutation<
      CreateTuitionFeeResponseDto,
      CreateTuitionFeeRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createTuitionFee(),
        method: 'POST',
        body,
      }),
    }),
    createTuitionFeeByGroup: create.mutation<
      CreateTuitionFeeByGroupResponseDto,
      CreateTuitionFeeByGroupRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createTuitionFeeByGroup(),
        method: 'POST',
        body,
      }),
    }),
    getTuitionFeesByStudentInRange: create.query<
      GetTuitionFeesByStudentInRangeResponseDto,
      GetTuitionFeesByStudentInRangeRequestDto
    >({
      query: (params) => endpointsUrl.getTuitionFeesByStudentInRange(params),
    }),
    getTuitionFeesByGroup: create.query<
      GetTuitionFeesByGroupResponseDto,
      GetTuitionFeesByGroupRequestDto
    >({
      query: (params) => endpointsUrl.getTuitionFeesByGroup(params),
    }),
    getOverdueTuitionFees: create.query<
      GetOverdueTuitionFeesResponseDto,
      GetOverdueTuitionFeesRequestDto
    >({
      query: (params) => endpointsUrl.getOverdueTuitionFees(params),
    }),
    filterTuitionFees: create.query<
      FilterTuitionFeesResponseDto,
      FilterTuitionFeesRequestDto
    >({
      query: (params) => endpointsUrl.filterTuitionFees(params),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateTuitionFeeMutation,
  useCreateTuitionFeeByGroupMutation,
  useGetTuitionFeesByStudentInRangeQuery,
  useGetTuitionFeesByGroupQuery,
  useGetOverdueTuitionFeesQuery,
  useFilterTuitionFeesQuery,
} = tuitionFeesApi;
