import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../../routes/routes';
import { formatFullName } from '../../helpers/formatFullName';
import { useGetMe } from '../../api/authMe';
import { accessTokenKey, deleteTokenCookie } from '../../helpers/tokenHandlers';

export const Header = () => {
  const { data, isLoading } = useGetMe();
  const user = data?.data;
  const navigate = useNavigate();
  console.log('user',user);
  const handleSignOut = () => {
    deleteTokenCookie(accessTokenKey);
    navigate(routes.signIn.getRoute());
  };

  return (
    <header className="bg-gray-800 text-white shadow-md h-16 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-4 h-full">
        <nav className="flex items-center justify-between h-full">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">
            Course App
          </Link>
          {!isLoading && (
            <div className="flex gap-6 items-center">
              {user ? (
                <>
                  <span className="text-gray-300">
                    Welcome, {formatFullName(user.first_name, user.last_name, user.patronym)}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="hover:text-gray-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={routes.signIn.path}
                    className="hover:text-gray-300 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to={routes.registration.path}
                    className="hover:text-gray-300 transition-colors"
                  >
                    Registration
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
