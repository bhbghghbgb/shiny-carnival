import type { ModuleRoutes } from '../type/types';
import HomePage from '../../../pages/HomePage';
import { PendingComponent } from '../../../components/feedback/PendingComponent';
import { ErrorComponent } from '../../../components/feedback/ErrorComponent';

// Home module routes configuration
export const homeRoutes: ModuleRoutes<any> = {
  moduleName: 'home',
  basePath: '/',
  routes: [
    {
      path: '/',
      component: HomePage,
      pendingComponent: PendingComponent,
      errorComponent: ErrorComponent,
      meta: {
        requiresAuth: false,
        title: 'Trang chủ',
      },
    },
  ],
};
