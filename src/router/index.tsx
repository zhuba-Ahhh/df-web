import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Navbar from '../components/Navbar';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <App />
      </>
    ),
  },

  {
    path: '*', // 匹配所有未定义的路径
    element: <Navigate to="/" />, // 重定向到首页
  },
]);

export default router;
