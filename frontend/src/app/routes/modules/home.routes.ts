import { type LegacyModuleRoutes } from '../type/types';
import { createRouteConfig } from '../utils/routeHelpers';
import HomePage from '../../../pages/HomePage';
import { PendingComponent } from '../../../components/feedback/PendingComponent';
import { ErrorComponent } from '../../../components/feedback/ErrorComponent';

// Home module routes configuration
export const homeRoutes: LegacyModuleRoutes = {
  moduleName: 'home',
  basePath: '/',
  routes: [
    createRouteConfig({
      path: '/',
      component: HomePage,
      pendingComponent: PendingComponent,
      errorComponent: ErrorComponent,
    })
  ],
};
