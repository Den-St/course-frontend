import { baseApi } from '../baseApi';
import type { AuthMeResponse } from './types';

const endpointsUrl = {
  user: '/users/get-me',
} as const;

export const authApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    getMe: create.query<AuthMeResponse, void>({
      query: () => endpointsUrl.user,
      providesTags: ['Auth'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetMeQuery } = authApi;
