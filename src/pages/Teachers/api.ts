import { baseApi } from '../../api/baseApi';
import type {
  GetTeachersSortedRequestDto,
  GetTeachersSortedResponseDto,
} from './types/types';

const endpointsUrl = {
  getTeachersSorted: (params: GetTeachersSortedRequestDto) => {
    const searchParams = new URLSearchParams();
    searchParams.append('sort_by', params.sortBy);
    if (params.order) {
      searchParams.append('order', params.order);
    }
    if (params.first_name !== undefined) {
      searchParams.append('first_name', params.first_name);
    }
    if (params.last_name !== undefined) {
      searchParams.append('last_name', params.last_name);
    }
    if (params.patronym !== undefined) {
      searchParams.append('patronym', params.patronym);
    }
    return `/teachers?${searchParams.toString()}`;
  },
} as const;

export const teachersApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    getTeachersSorted: create.query<
      GetTeachersSortedResponseDto,
      GetTeachersSortedRequestDto
    >({
      query: (params) => endpointsUrl.getTeachersSorted(params),
    }),
  }),
  overrideExisting: true,
});

export const { useGetTeachersSortedQuery } = teachersApi;
