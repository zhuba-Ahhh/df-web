import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import NProgress from 'nprogress';
import { http } from 'utils';
import { AppContext, AppContextType } from './AppContext';
import { fetchCookieList } from 'services/info'; // 从 services 导入接口方法

const ck = localStorage.getItem('ck') || '';
const seasonid = localStorage.getItem('seasonid') || '4';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<AppContextType | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(window.innerWidth < 768);

  const updateConfig = useCallback((partialConfig: Partial<AppContextType>) => {
    setConfig((prevConfig) => (prevConfig ? { ...prevConfig, ...partialConfig } : null));
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuCollapsed((prev) => !prev);
  }, []);

  const fetchConfig = useCallback(async () => {
    const ckOptions = await fetchCookieList();
    const res = await http.get<Omit<AppContextType, 'isMenuCollapsed' | 'toggleMenu'>>('/config');
    setConfig({
      ...res,
      isMenuCollapsed,
      toggleMenu,
      ck,
      seasonid,
      updateConfig,
      ckOptions: ckOptions.filter((item) => item && item.label && item.value),
    });
  }, [isMenuCollapsed, toggleMenu, updateConfig]);

  useEffect(() => {
    NProgress.start();

    const handleResize = () => {
      setIsMenuCollapsed(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    fetchConfig().finally(() => {
      setIsLoading(false);
      NProgress.done();
    });

    return () => window.removeEventListener('resize', handleResize);
  }, [fetchConfig]);

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">
        加载中...
      </div>
    );
  }

  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
