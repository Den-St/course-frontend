import { lazy } from 'react';

export const SignIn = lazy(() => import('../pages/SignIn/SignIn'));
export const Registration = lazy(() => import('../pages/Registration/Registration'));
export const StudentCourses = lazy(() => import('../pages/Courses/StudentCourses/StudentCourses'));
export const TeacherCourses = lazy(() => import('../pages/Courses/TeacherCourses/TeacherCourses'));
export const AdminCourses = lazy(() => import('../pages/Courses/AdminCourses/AdminCourses'));
export const AdminStudents = lazy(() => import('../pages/Students/AdminStudents/AdminStudents'));
export const AdminGroups = lazy(() => import('../pages/Groups/AdminGroups/AdminGroups'));
