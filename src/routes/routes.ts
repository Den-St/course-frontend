export const routes = {
  signIn: {
    path: '/signin',
    getRoute: () => '/signin',
  },
  registration: {
    path: '/registration',
    getRoute: () => '/registration',
  },
  homePage: {
    path: '/',
    getRoute: () => '/',
  },
} as const;
