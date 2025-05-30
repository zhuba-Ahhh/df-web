import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import { PropsView } from 'views/PropsView';
import { ArmsView } from 'views/ArmsView';
import { ProtectView } from 'views/ProtectView';
import { AccView } from 'views/Acc';
import { AgentView } from 'views/AgentView';
import { InfoView } from 'views/InfoView';
import { MapView } from 'views/MapView';
import { SettingView } from 'views/SettingView';
import { MatchDetailView } from 'views/MatchDetailView';
import { ThreadDetailView } from 'views/ThreadDetailView';
import { AssetsView } from 'views/AssetsView';
import { CollectsVew } from 'views/CollectsVew';
import { WeekReportView } from 'views/WeekReportView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <InfoView />,
      },
      {
        path: '/info',
        element: <InfoView />,
      },
      {
        path: '/match',
        element: <MatchDetailView />,
      },
      {
        path: '/thread',
        element: <ThreadDetailView />,
      },
      {
        path: '/collect',
        element: <CollectsVew />,
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
      {
        path: '/setting',
        element: <SettingView />,
      },
      {
        path: '/assets',
        element: <AssetsView />,
      },
      {
        path: '/week-report', // 新增周报页面路由
        element: <WeekReportView />,
      },
    ],
  },
  {
    path: '*', // 匹配所有未定义的路径
    element: <Navigate to="/" replace />, // 重定向到首页
  },
]);

export default router;
