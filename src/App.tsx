import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import Loading from './components/Loading';
import Menu from 'components/Menu';
import { Outlet } from 'react-router-dom';
import Navbar from 'components/Navbar';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    NProgress.start();
    setTimeout(() => {
      setIsLoading(false);
      NProgress.done();
    }, 1000);
  }, []);

  return (
    <>
      <Navbar />
      <main className="container max-w-[100vw] pt-[64px] flex h-[100vh] overflow-y-hidden">
        <div className="w-[160px] min-h-[100vh] overflow-y-auto">
          <Menu />
        </div>
        <div className="min-h-[calc(100vh - 64px)] w-[calc(100vw-160px)] overflow-y-auto">
          {isLoading ? <Loading /> : <Outlet />}
        </div>
      </main>
    </>
  );
}

export default App;
