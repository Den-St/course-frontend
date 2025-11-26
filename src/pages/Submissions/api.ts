import { baseApi } from '../../api/baseApi';
import type {
  CreateSubmissionRequestDto,
  CreateSubmissionResponseDto,
  FilterSubmissionRequestDto,
  FilterSubmissionResponseDto,
  EditSubmissionDto,
  EditSubmissionResponseDto,
} from './types/types';

const endpointsUrl = {
  createSubmission: () => `/submissions/create`,
  filterSubmissions: () => `/submissions/filter`,
  editSubmission: () => `/submissions/edit`,
} as const;

export const submissionsApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    createSubmission: create.mutation<
      CreateSubmissionResponseDto,
      CreateSubmissionRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.createSubmission(),
        method: 'POST',
        body,
      }),
    }),
    filterSubmissions: create.mutation<
      {data: FilterSubmissionResponseDto[]},
      FilterSubmissionRequestDto
    >({
      query: (body) => ({
        url: endpointsUrl.filterSubmissions(),
        method: 'POST',
        body,
      }),
    }),
    editSubmission: create.mutation<
      EditSubmissionResponseDto,
      EditSubmissionDto
    >({
      query: (body) => ({
        url: endpointsUrl.editSubmission(),
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateSubmissionMutation,
  useFilterSubmissionsMutation,
  useEditSubmissionMutation,
} = submissionsApi;
