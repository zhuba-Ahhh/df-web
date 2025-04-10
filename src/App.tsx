import { useEffect, useState, createContext, useCallback } from 'react';

import NProgress from 'nprogress';
import Loading from './components/Loading';
import Menu from 'components/Menu';
import { Outlet } from 'react-router-dom';
import Navbar from 'components/Navbar';
import { http } from 'utils';
import { ckOptions } from 'common/const';
import { TeammateArr } from 'types/info';

// 添加 Context 类型定义
interface ContextType {
  mapName: Record<string, string>;
  agentImg: Record<number, string>;
  agentName: Record<number, string>;
  isMenuCollapsed?: boolean;
  rank: Record<number, string>;
  seasonOptions: string[];
  ck: string;
  seasonid: string;
  teammateArr?: TeammateArr[];
  toggleMenu?: () => void;
  updateConfig?: (partialConfig: Partial<ContextType>) => void;
}
const ck = localStorage.getItem('ck') || ckOptions[0].value;
const seasonid = localStorage.getItem('seasonid') || '3';

export const Context = createContext<ContextType | null>(null);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<ContextType | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(window.innerWidth < 768);

  const updateConfig = useCallback((partialConfig: Partial<ContextType>) => {
    setConfig((prevConfig) => (prevConfig ? { ...prevConfig, ...partialConfig } : null));
  }, []);

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
      ck,
      seasonid,
      updateConfig,
    });
  }, [isMenuCollapsed, toggleMenu, updateConfig]);

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
          {isLoading ? <Loading /> : <Outlet />}
        </div>
      </main>
    </Context.Provider>
  );
};

export default App;
