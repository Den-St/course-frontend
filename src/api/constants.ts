export const baseURL =
  import.meta.env.VITE_APP_BACKEND_URL || "__VITE_APP_BACKEND_URL__";

export const authorizationKey = 'Authorization';

export const clientUrl = import.meta.env.DEV
  ? 'http://localhost:3000/'
  : 'https://collegejournal.ovh/';
