import { Link } from 'react-router-dom';
import { routes } from '../../routes/routes';
import { Header } from '../Header/Header';
import { NavBar } from '../NavBar/NavBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Header />
      <div className="flex flex-1">
        <NavBar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
