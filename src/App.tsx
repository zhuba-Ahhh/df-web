import { Outlet } from 'react-router-dom';
import { AppProvider } from './contexts/AppProvider';
import Layout from './components/Layout';

const App = () => {
  return (
    <AppProvider>
      <Layout>
        <Outlet />
      </Layout>
    </AppProvider>
  );
};

export default App;
