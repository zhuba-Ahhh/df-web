import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import Loading from './components/Loading';
import { AgentView } from 'views/AgentView';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    NProgress.start();
    setTimeout(() => {
      setIsLoading(false);
      NProgress.done();
    }, 1000);
  }, []);

  return <main className="container mx-auto">{isLoading ? <Loading /> : <AgentView />}</main>;
}

export default App;
