import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { SignIn, Registration } from './pages';
import { Layout } from '../components/Layout/Layout';

export const PublicRoutes = [
  <Route
    key={routes.signIn.path}
    element={<SignIn />}
    path={routes.signIn.path}
  />,
  <Route
    key={routes.registration.path}
    element={<Registration />}
    path={routes.registration.path}
  />,
  <Route
    key={'/'}
    element={<SignIn />}
    path={'/'}
  />,
];

export const RoutesSwitch = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>{PublicRoutes}</Routes>
      </Suspense>
    </Layout>
  );
};
