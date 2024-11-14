import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import BackToTopButton from './components/BackToTopButton';

import './main.less';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { RouterProvider } from 'react-router-dom';
import router from './router';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
      <BackToTopButton />
    </StrictMode>
  );
}
