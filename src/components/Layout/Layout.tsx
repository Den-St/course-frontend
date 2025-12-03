import { Header } from '../Header/Header';
import { NavBar } from '../NavBar/NavBar';
import { useGetMe } from '../../api/authMe';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useGetMe();

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Header />
      <div className="flex flex-1">
        {isAuthenticated && <NavBar />}
        <main className={`flex-1 ${isAuthenticated ? 'ml-64' : ''} p-8 overflow-y-auto`}>
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
