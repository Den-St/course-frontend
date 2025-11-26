import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { SignIn, Registration, StudentCourses, TeacherCourses, AdminCourses, AdminStudents, AdminGroups, AdminTeachers, TeacherLessons, TeacherAssignments, TeacherSubmissions, TeacherSubmission, StudentLessons, StudentAssignments, StudentAssignment, StudentSubmissions, AccountantTuitionFees, AccountantPayments, ParentStudents, ParentsAttendances, ParentsLessons, ParentsAssignments, ParentsAssignment, ParentsTuitionFees, ParentsPayments } from './pages';
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
  <Route
    key={routes.adminTeachers.path}
    element={<AdminTeachers />}
    path={routes.adminTeachers.path}
  />,
  <Route
    key={routes.teacherLessons.path}
    element={<TeacherLessons />}
    path={routes.teacherLessons.path}
  />,
  <Route
    key={routes.teacherAssignments.path}
    element={<TeacherAssignments />}
    path={routes.teacherAssignments.path}
  />,
  <Route
    key={routes.teacherSubmissions.path}
    element={<TeacherSubmissions />}
    path={routes.teacherSubmissions.path}
  />,
  <Route
    key={routes.teacherSubmission.path}
    element={<TeacherSubmission />}
    path={routes.teacherSubmission.path}
  />,
  <Route
    key={routes.studentLessons.path}
    element={<StudentLessons />}
    path={routes.studentLessons.path}
  />,
  <Route
    key={routes.studentAssignments.path}
    element={<StudentAssignments />}
    path={routes.studentAssignments.path}
  />,
  <Route
    key={routes.studentAssignment.path}
    element={<StudentAssignment />}
    path={routes.studentAssignment.path}
  />,
  <Route
    key={routes.studentSubmissions.path}
    element={<StudentSubmissions />}
    path={routes.studentSubmissions.path}
  />,
  <Route
    key={routes.accountantTuitionFees.path}
    element={<AccountantTuitionFees />}
    path={routes.accountantTuitionFees.path}
  />,
  <Route
    key={routes.accountantPayments.path}
    element={<AccountantPayments />}
    path={routes.accountantPayments.path}
  />,
  <Route
    key={routes.parentStudents.path}
    element={<ParentStudents />}
    path={routes.parentStudents.path}
  />,
  <Route
    key={routes.parentsAttendances.path}
    element={<ParentsAttendances />}
    path={routes.parentsAttendances.path}
  />,
  <Route
    key={routes.parentsLessons.path}
    element={<ParentsLessons />}
    path={routes.parentsLessons.path}
  />,
  <Route
    key={routes.parentsAssignments.path}
    element={<ParentsAssignments />}
    path={routes.parentsAssignments.path}
  />,
  <Route
    key={routes.parentsAssignment.path}
    element={<ParentsAssignment />}
    path={routes.parentsAssignment.path}
  />,
  <Route
    key={routes.parentsTuitionFees.path}
    element={<ParentsTuitionFees />}
    path={routes.parentsTuitionFees.path}
  />,
  <Route
    key={routes.parentsPayments.path}
    element={<ParentsPayments />}
    path={routes.parentsPayments.path}
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
