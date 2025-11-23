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
  ];

  const teacherNavItems = [
    { path: routes.homePage.path, label: 'Home' },
    { path: routes.teacherCourses.path, label: 'Courses' },
    { path: routes.teacherLessons.path, label: 'Lessons' },
  ];

  const parentNavItems = [
    { path: routes.homePage.path, label: 'Home' },
  ];

  const adminNavItems = [
    { path: routes.homePage.path, label: 'Home' },
    { path: routes.adminCourses.path, label: 'Courses' },
    { path: routes.adminStudents.path, label: 'Students' },
    { path: routes.adminGroups.path, label: 'Groups' },
    { path: routes.adminTeachers.path, label: 'Teachers' },
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
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => location.pathname === path;

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
