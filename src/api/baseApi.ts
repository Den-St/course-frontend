import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  accessTokenKey,
  getToken,
} from '../helpers/tokenHandlers';
import { authorizationKey, baseURL } from './constants';

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: (headers) => {
    const token = getToken(accessTokenKey);
    if (token) {
      headers.set(authorizationKey, `Bearer ${token}`);
    }
    return headers;
  },
  // credentials: 'include', // TODO: refactor refresh token to http-only cookie
});

export const baseApi = createApi({
  baseQuery: baseQuery,
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});
