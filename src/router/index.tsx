import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { PropsView } from 'views/PropsView';
import { ArmsView } from 'views/ArmsView';
import { ProtectView } from 'views/ProtectView';
import { AccView } from 'views/Acc';
import { AgentView } from 'views/AgentView';
import MapView from 'views/MapView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <AgentView />,
      },
      {
        path: '/props/:type?',
        element: <PropsView />,
      },
      {
        path: '/agent/:type?',
        element: <AgentView />,
      },
      {
        path: '/arms/:type?',
        element: <ArmsView />,
      },
      {
        path: '/protect/:type?',
        element: <ProtectView />,
      },
      {
        path: '/acc/:type?',
        element: <AccView />,
      },
      {
        path: '/map',
        element: <MapView />,
      },
    ],
  },
  {
    path: '*', // 匹配所有未定义的路径
    element: <Navigate to="/" replace />, // 重定向到首页
  },
]);

export default router;
