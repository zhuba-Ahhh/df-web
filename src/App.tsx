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
      <main className="container min-h-[100vh] max-w-[100vw] pt-[64px] flex">
        <Menu />
        {isLoading ? (
          <div className="w-[calc(100vw-160px)]">
            <Loading />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}

export default App;