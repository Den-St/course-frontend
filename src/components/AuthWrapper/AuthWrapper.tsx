import { useGetMe } from '../../api/authMe';
import { routes } from '../../routes/routes';
import { useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthWrapperProps {
  children: ReactNode;
}

const publicRoutes:string[] = [routes.signIn.path, routes.registration.path];

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { data, isLoading, isAuthenticated } = useGetMe();
  const navigate = useNavigate();
  const location = useLocation();

  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      navigate(routes.signIn.getRoute());
    }
  }, [data, isLoading, navigate, isAuthenticated, isPublicRoute]);

  if (isLoading && !isPublicRoute) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};
