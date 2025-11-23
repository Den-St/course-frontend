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
  studentCourses: {
    path: '/student-courses',
    getRoute: () => '/student-courses',
  },
  teacherCourses: {
    path: '/teacher-courses',
    getRoute: () => '/teacher-courses',
  },
  adminCourses: {
    path: '/admin-courses',
    getRoute: () => '/admin-courses',
  },
  adminStudents: {
    path: '/admin/students',
    getRoute: () => '/admin/students',
  },
  adminGroups: {
    path: '/admin/groups',
    getRoute: () => '/admin/groups',
  },
} as const;
