import { skipToken } from '@reduxjs/toolkit/query';
import { authApi } from '../api';
import { accessTokenKey, getToken } from '../../../helpers/tokenHandlers';

export const useGetMe = () => {
  const token = getToken(accessTokenKey);
  
  const { data, error, isError, isLoading, refetch } = authApi.useGetMeQuery(
    token ? undefined : skipToken
  );

  return {
    data,
    error,
    isLoading,
    refetch,
    isError,
    isAuthenticated: !!data && !isError,
  };
};
3