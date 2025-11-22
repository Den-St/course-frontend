import { baseApi } from '../../api/baseApi';
import type { RegisterApiReq, RegisterApiRes } from './types';

const endpointsUrl = {
  register: '/register',
} as const;

export const registrationApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    register: create.mutation<RegisterApiRes, RegisterApiReq>({
      query: (formData) => ({
        url: endpointsUrl.register,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: true,
});

export const { useRegisterMutation } = registrationApi;
