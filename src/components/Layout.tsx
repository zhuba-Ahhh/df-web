import { ReactNode } from 'react';
import Navbar from './Navbar';
import Menu from './Menu';
import Loading from './Loading';
import { useAppContext } from 'contexts/AppProvider';

interface LayoutProps {
  children: ReactNode;
  isLoading?: boolean;
}

const Layout = ({ children, isLoading }: LayoutProps) => {
  const { isMenuCollapsed } = useAppContext();

  return (
    <>
      <Navbar />
      <main className="container max-w-[100vw] pt-[64px] flex h-[100vh] overflow-y-hidden">
        <div
          className={`transition-all duration-300 overflow-y-auto scrollbar-hide ${
            isMenuCollapsed ? 'w-0' : 'w-[160px]'
          } min-h-[100vh]`}
        >
          <Menu />
        </div>
        <div
          className={`min-h-[calc(100vh - 64px)] transition-all duration-300 scrollbar-hide overflow-y-auto ${
            isMenuCollapsed ? 'w-[100vw]' : 'w-[calc(100vw-160px)]'
          }`}
        >
          {isLoading ? <Loading /> : children}
        </div>
      </main>
    </>
  );
};

export default Layout;
