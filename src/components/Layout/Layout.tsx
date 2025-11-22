import { Link } from 'react-router-dom';
import { routes } from '../../routes/routes';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold hover:text-gray-300">
              Course App
            </Link>
            <div className="flex gap-6">
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
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
