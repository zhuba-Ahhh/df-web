import { useEffect, useState, createContext, useCallback } from 'react';

import NProgress from 'nprogress';
import Loading from './components/Loading';
import Menu from 'components/Menu';
import { Outlet } from 'react-router-dom';
import Navbar from 'components/Navbar';
import { http } from 'utils';

// 添加 Context 类型定义
interface ContextType {
  mapName: Record<string, string>;
  agentImg: Record<number, string>;
  agentName: Record<number, string>;
  isMenuCollapsed?: boolean;
  toggleMenu?: () => void;
}

export const Context = createContext<ContextType | null>(null);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<ContextType | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(window.innerWidth < 768);

  const toggleMenu = useCallback(() => {
    setIsMenuCollapsed((prev) => !prev);
  }, []);

  // Combine the config fetching and menu state management
  const fetchConfig = useCallback(async () => {
    const res = await http.get<Omit<ContextType, 'isMenuCollapsed' | 'toggleMenu'>>('/config');
    setConfig({
      ...res,
      isMenuCollapsed,
      toggleMenu,
    });
  }, [isMenuCollapsed, toggleMenu]);

  // Initialize app and handle window resize
  useEffect(() => {
    NProgress.start();

    const handleResize = () => {
      setIsMenuCollapsed(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // Initial fetch
    fetchConfig().finally(() => {
      setIsLoading(false);
      NProgress.done();
    });

    return () => window.removeEventListener('resize', handleResize);
  }, [fetchConfig]);

  return (
    <Context.Provider value={config}>
      <Navbar />
      <main className="container max-w-[100vw] pt-[64px] flex h-[100vh] overflow-y-hidden">
        <div
          className={`transition-all duration-300 overflow-y-auto ${
            isMenuCollapsed ? 'w-0' : 'w-[160px]'
          } min-h-[100vh]`}
        >
          <Menu />
        </div>
        <div
          className={`min-h-[calc(100vh - 64px)] transition-all duration-300 overflow-y-auto ${
            isMenuCollapsed ? 'w-[100vw]' : 'w-[calc(100vw-160px)]'
          }`}
        >
          {isLoading ? <Loading /> : <Outlet />}
        </div>
      </main>
    </Context.Provider>
  );
}

export default App;
