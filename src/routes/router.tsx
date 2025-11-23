import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { SignIn, Registration, StudentCourses, TeacherCourses, AdminCourses, AdminStudents, AdminGroups } from './pages';
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
    element={<></>}
    path={'/'}
  />,
  <Route
    key={routes.studentCourses.path}
    element={<StudentCourses />}
    path={routes.studentCourses.path}
  />,
  <Route
    key={routes.teacherCourses.path}
    element={<TeacherCourses />}
    path={routes.teacherCourses.path}
  />,
  <Route
    key={routes.adminCourses.path}
    element={<AdminCourses />}
    path={routes.adminCourses.path}
  />,
  <Route
    key={routes.adminStudents.path}
    element={<AdminStudents />}
    path={routes.adminStudents.path}
  />,
  <Route
    key={routes.adminGroups.path}
    element={<AdminGroups />}
    path={routes.adminGroups.path}
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
