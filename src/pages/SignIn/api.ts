import { baseApi } from '../../api/baseApi';
import type { SignInApiReq, SignInApiRes } from './types';

const endpointsUrl = {
  signIn: '/signin/signin',
} as const;

export const signInApi = baseApi.injectEndpoints({
  endpoints: (create) => ({
    signIn: create.mutation<SignInApiRes, SignInApiReq>({
      query: (formData) => ({
        url: endpointsUrl.signIn,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: true,
});

export const { useSignInMutation } = signInApi;
