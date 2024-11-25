import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { PropsView } from 'views/PropsView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/props',
        element: <PropsView />,
      },
      {
        path: '/props/:type',
        element: <PropsView />,
      },
    ],
  },
  {
    path: '*', // 匹配所有未定义的路径
    element: <Navigate to="/" />, // 重定向到首页
  },
]);

export default router;
