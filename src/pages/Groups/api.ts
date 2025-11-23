import { baseApi } from '../../api/baseApi';
import type {
  CreateGroupRequestDto,
  CreateGroupResponseDto,
  FilterGroupsRequestDto,
  FilterGroupsResponseDto,
} from './types/types';

const endpointsUrl = {
  createGroup: () => `/groups/create`,
  filterGroups: (params: FilterGroupsRequestDto) => {
    const searchParams = new URLSearchParams();
    if (params.name !== undefined) {
      searchParams.append('name', params.name);
    }
    if (params.grade_level !== undefined) {
      searchParams.append('grade_level', params.grade_level.toString());
    }
    if (params.start_year !== undefined) {
      searchParams.append('start_year', params.start_year.toString());
    }
    if (params.curator_id !== undefined) {
      searchParams.append('curator_id', params.curator_id.toString());
    }
    return `/groups/filter?${searchParams.toString()}`;
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
  }),
  overrideExisting: true,
});

export const {
  useCreateGroupMutation,
  useFilterGroupsQuery,
} = groupsApi;
