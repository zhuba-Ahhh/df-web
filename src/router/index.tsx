import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { PropsView } from 'views/PropsView';
import { ArmsView } from 'views/ArmsView';
import { ProtectView } from 'views/ProtectView';
import { AccView } from 'views/Acc';

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
      {
        path: '/arms',
        element: <ArmsView />,
      },
      {
        path: '/arms/:type',
        element: <ArmsView />,
      },
      {
        path: '/protect',
        element: <ProtectView />,
      },
      {
        path: '/protect/:type',
        element: <ProtectView />,
      },
      {
        path: '/acc',
        element: <AccView />,
      },
      {
        path: '/acc/:type',
        element: <AccView />,
      },
    ],
  },
  {
    path: '*', // 匹配所有未定义的路径
    element: <Navigate to="/" />, // 重定向到首页
  },
]);

export default router;
