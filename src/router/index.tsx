/* eslint-disable import/no-unresolved */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import React, { lazy, Suspense } from 'react'; // 导入 lazy 和 Suspense
import App from '../App';
import InfoView from 'views/InfoView';

// 懒加载所有视图组件

const PropsView = lazy(() => import('views/PropsView'));
const ArmsView = lazy(() => import('views/ArmsView'));
const ProtectView = lazy(() => import('views/ProtectView'));
const AccView = lazy(() => import('views/Acc'));
const AgentView = lazy(() => import('views/AgentView'));
const MapView = lazy(() => import('views/MapView'));
const SettingView = lazy(() => import('views/SettingView'));
const MatchDetailView = lazy(() => import('views/MatchDetailView'));
const ThreadDetailView = lazy(() => import('views/ThreadDetailView'));
const CollectsVew = lazy(() => import('views/CollectsVew'));
const WeekReportView = lazy(() => import('views/WeekReportView'));

// 建议：创建一个通用的加载中组件，例如 <PageLoader />
// eslint-disable-next-line react-refresh/only-export-components
const LazyLoad = (Component: React.ElementType) => (
  <Suspense fallback={<div>加载中...</div>}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App 组件内部应该有一个 <Suspense> 包裹 <Outlet />
    children: [
      {
        path: '/',
        element: <InfoView />,
      },
      {
        path: '/info',
        element: LazyLoad(InfoView),
      },
      {
        path: '/match',
        element: LazyLoad(MatchDetailView),
      },
      {
        path: '/thread',
        element: LazyLoad(ThreadDetailView),
      },
      {
        path: '/collect',
        element: LazyLoad(CollectsVew),
      },
      {
        path: '/props/:type?',
        element: LazyLoad(PropsView),
      },
      {
        path: '/agent/:type?',
        element: LazyLoad(AgentView),
      },
      {
        path: '/arms/:type?',
        element: LazyLoad(ArmsView),
      },
      {
        path: '/protect/:type?',
        element: LazyLoad(ProtectView),
      },
      {
        path: '/acc/:type?',
        element: LazyLoad(AccView),
      },
      {
        path: '/map',
        element: LazyLoad(MapView),
      },
      {
        path: '/setting',
        element: LazyLoad(SettingView),
      },
      {
        path: '/week-report',
        element: LazyLoad(WeekReportView),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
