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
  adminTeachers: {
    path: '/admin/teachers',
    getRoute: () => '/admin/teachers',
  },
  teacherLessons: {
    path: '/teacher/lessons',
    getRoute: () => '/teacher/lessons',
  },
  teacherAssignments: {
    path: '/teacher/assignments',
    getRoute: () => '/teacher/assignments',
  },
  teacherSubmissions: {
    path: '/teacher/submissions',
    getRoute: () => '/teacher/submissions',
  },
  teacherSubmission: {
    path: '/teacher/submissions/:id',
    getRoute: (id: number | string) => `/teacher/submissions/${id}`,
  },
  studentLessons: {
    path: '/student/lessons',
    getRoute: () => '/student/lessons',
  },
  studentAssignments: {
    path: '/student/assignments',
    getRoute: () => '/student/assignments',
  },
  studentAssignment: {
    path: '/student/assignments/:id',
    getRoute: (id: number | string) => `/student/assignments/${id}`,
  },
  studentSubmissions: {
    path: '/student/submissions',
    getRoute: () => '/student/submissions',
  },
  accountantTuitionFees: {
    path: '/accountant/tuition-fees',
    getRoute: () => '/accountant/tuition-fees',
  },
  accountantPayments: {
    path: '/accountant/payments',
    getRoute: () => '/accountant/payments',
  },
  parentStudents: {
    path: '/parents/students',
    getRoute: () => '/parents/students',
  },
  parentsAttendances: {
    path: '/parents/attendances',
    getRoute: () => '/parents/attendances',
  },
  parentsLessons: {
    path: '/parents/lessons',
    getRoute: () => '/parents/lessons',
  },
  parentsAssignments: {
    path: '/parents/assignments',
    getRoute: () => '/parents/assignments',
  },
  parentsAssignment: {
    path: '/parents/assignments/:id',
    getRoute: (id: number | string) => `/parents/assignments/${id}`,
  },
  parentsTuitionFees: {
    path: '/parents/tuition-fees',
    getRoute: () => '/parents/tuition-fees',
  },
  parentsPayments: {
    path: '/parents/payments',
    getRoute: () => '/parents/payments',
  },
  teacherAttendances: {
    path: '/teacher/attendances',
    getRoute: () => '/teacher/attendances',
  },
} as const;
