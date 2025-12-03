import { baseApi } from '../../api/baseApi';
import type {
  CreateGroupRequestDto,
  CreateGroupResponseDto,
  FilterGroupsRequestDto,
  FilterGroupsResponseDto,
} from './types/types';

// types for GetGroupsByTeacherEnrollments
export type GetGroupsByTeacherEnrollmentsRequestDto = {
  teacher_id: number;
};

export type GetGroupsByTeacherEnrollmentsItemDto = {
  id: number;
  name: string;
  start_year: number | null;
  curator_id: number | null;
  curator_name: string | null;
  student_count: number;
};

export type GetGroupsByTeacherEnrollmentsResponseDto = {
  groups: GetGroupsByTeacherEnrollmentsItemDto[];
};

const endpointsUrl = {
  createGroup: () => `/groups/create`,
  filterGroups: (params: FilterGroupsRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.name !== undefined) {
      searchParams.append('name', params.name);
    }
    if (params.start_year !== undefined) {
      searchParams.append('start_year', params.start_year.toString());
    }
    if (params.curator_id !== undefined) {
      searchParams.append('curator_id', params.curator_id.toString());
    }
    return `/groups/filter?${searchParams.toString()}`;
  },
  byTeacherEnrollments: (params: GetGroupsByTeacherEnrollmentsRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.teacher_id !== undefined) {
      searchParams.append('teacher_id', params.teacher_id.toString());
    }
    return `/groups/by-teacher-enrollments?${searchParams.toString()}`;
  },
} as const;

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    createGroup: create.mutation<
      CreateGroupResponseDto,
      CreateGroupRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createGroup(),
        method: 'POST',
        body,
      }),
    }),
    filterGroups: create.query<
      FilterGroupsResponseDto,
      FilterGroupsRequestDto
    >({
      query: (params) => endpointsUrl.filterGroups(params),
    }),
    filterGroupsByTeacherEnrollments: create.query<
      GetGroupsByTeacherEnrollmentsResponseDto,
      GetGroupsByTeacherEnrollmentsRequestDto
    >({
      query: (params) => endpointsUrl.byTeacherEnrollments(params),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateGroupMutation,
  useFilterGroupsQuery,
  useFilterGroupsByTeacherEnrollmentsQuery,
} = groupsApi;
