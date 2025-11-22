import Cookies from 'js-cookie';

type TokenKeyT = 'refresh' | 'access';

export const refreshTokenKey = 'refresh';
export const accessTokenKey = 'access';

export const setToken = (tokenKey: TokenKeyT, token: string) => {
  Cookies.set(tokenKey, token);
};
export const getTokenSessionStorage = (tokenKey: TokenKeyT) => {
  const token = sessionStorage.getItem(tokenKey);
  return token || null;
};
export const getToken = (tokenKey: TokenKeyT) => {
  return Cookies.get(tokenKey) || getTokenSessionStorage(tokenKey) || '';
};
export const deleteTokenCookie = (tokenKey: TokenKeyT) => {
  Cookies.remove(tokenKey);
};
export const setTokenSessionStorage = (tokenKey: TokenKeyT, token: string) => {
  sessionStorage.setItem(tokenKey, token);
};
export const deleteTokenSessionStorage = (tokenKey: TokenKeyT) => {
  sessionStorage.removeItem(tokenKey);
};
