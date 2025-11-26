import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../routes/routes';
import { useGetMe } from '../../api/authMe/hooks/useGetMe';

export const NavBar = () => {
  const location = useLocation();
  const { data } = useGetMe();
  const user = data?.data;
  const studentNavItems = [
    { path: routes.homePage.path, label: 'Home' },
    { path: routes.studentCourses.path, label: 'Courses' },
    { path: routes.studentLessons.path, label: 'Lessons' },
    { path: routes.studentAssignments.path, label: 'Assignments' },
    { path: routes.studentSubmissions.path, label: 'Submissions' },
  ];

  const teacherNavItems = [
    { path: routes.homePage.path, label: 'Home' },
    { path: routes.teacherCourses.path, label: 'Courses' },
    { path: routes.teacherLessons.path, label: 'Lessons' },
    { path: routes.teacherAssignments.path, label: 'Assignments' },
    { path: routes.teacherSubmissions.path, label: 'Submissions' },
  ];

  const parentNavItems = [
    { path: routes.homePage.path, label: 'Home' },
    { path: routes.parentStudents.path, label: 'Students' },
    { path: routes.parentsAttendances.path, label: 'Attendances' },
    { path: routes.parentsLessons.path, label: 'Lessons' },
    { path: routes.parentsAssignments.path, label: 'Assignments' },
    { path: routes.parentsTuitionFees.path, label: 'Tuition Fees' },
    { path: routes.parentsPayments.path, label: 'Payments' },
  ];

  const adminNavItems = [
    { path: routes.homePage.path, label: 'Home' },
    { path: routes.adminCourses.path, label: 'Courses' },
    { path: routes.adminStudents.path, label: 'Students' },
    { path: routes.adminGroups.path, label: 'Groups' },
    { path: routes.adminTeachers.path, label: 'Teachers' },
  ];

  const accountantNavItems = [
    { path: routes.homePage.path, label: 'Home' },
    { path: routes.accountantTuitionFees.path, label: 'Tuition Fees' },
    { path: routes.accountantPayments.path, label: 'Payments' },
  ];

  const getNavItems = () => {
    if (!user?.role) return studentNavItems;
    
    switch (user.role) {
      case 'student':
        return studentNavItems;
      case 'teacher':
        return teacherNavItems;
      case 'parent':
        return parentNavItems;
      case 'admin':
        return adminNavItems;
      case 'accountant':
        return accountantNavItems;
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => location.pathname === path;
  if (!user?.role) return;
  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
